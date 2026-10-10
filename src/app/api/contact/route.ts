import {createHash, randomUUID} from 'node:crypto';
import nodemailer from 'nodemailer';
import {NextResponse} from 'next/server';
import {contactDetails} from '@/content/contact-details';
import {getMailConfig} from '@/lib/contact-mail';

export const runtime = 'nodejs';

const fields = {name: [2, 120], email: [3, 254], organization: [0, 160], role: [0, 120], subject: [3, 180], message: [20, 5000]} as const;
const topicLabels: Record<string, string> = {research: 'Research collaboration', education: 'Education & events', partnership: 'Institutional partnerships', general: 'General & media enquiries'};
const emailPattern = /^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
const maxBodyBytes = 32 * 1024;
const windowMs = 15 * 60 * 1000;
// Process-local throttling for a single Node server; hashes expire after 15 minutes.
const attempts = new Map<string, {count: number; expires: number}>();
let total = {count: 0, expires: 0};

function allowAttempt(email: string) {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  if (total.expires <= now) total = {count: 0, expires: now + windowMs};
  const key = createHash('sha256').update(email.toLowerCase()).digest('hex');
  const entry = attempts.get(key) || {count: 0, expires: now + windowMs};
  if (entry.count >= 3 || total.count >= 30) return false;
  attempts.set(key, {count: entry.count + 1, expires: entry.expires});
  total.count += 1;
  return true;
}

function errorResponse(code: number, en: string, fa: string, persian = false) {
  return NextResponse.json({error: persian ? fa : en}, {status: code, headers: {'Cache-Control': 'no-store', ...(code === 429 ? {'Retry-After': '900'} : {})}});
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const requestUrl = new URL(request.url);
  const allowedOrigins = [requestUrl.origin];
  // Next's dev server normalizes its URL to localhost even when opened via 127.0.0.1.
  if (process.env.NODE_ENV === 'development') {
    const port = requestUrl.port ? `:${requestUrl.port}` : '';
    for (const host of ['localhost', '127.0.0.1', '[::1]']) allowedOrigins.push(`${requestUrl.protocol}//${host}${port}`);
  }
  if (process.env.KRISM_SITE_URL) {
    try { allowedOrigins.push(new URL(process.env.KRISM_SITE_URL).origin); } catch { /* An invalid configured origin is never trusted. */ }
  }
  if (!origin || !allowedOrigins.includes(origin)) return errorResponse(403, 'This request is not allowed.', 'این درخواست مجاز نیست.');
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return errorResponse(415, 'JSON is required.', 'قالب JSON لازم است.');

  let payload: Record<string, unknown>;
  try {
    if (Number(request.headers.get('content-length')) > maxBodyBytes) return errorResponse(413, 'The enquiry is too large.', 'درخواست بیش از حد طولانی است.');
    const reader = request.body?.getReader();
    if (!reader) return errorResponse(400, 'Invalid enquiry.', 'درخواست نامعتبر است.');
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBodyBytes) {await reader.cancel(); return errorResponse(413, 'The enquiry is too large.', 'درخواست بیش از حد طولانی است.');}
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid object');
    payload = parsed as Record<string, unknown>;
  } catch {
    return errorResponse(400, 'Invalid enquiry.', 'درخواست نامعتبر است.');
  }

  const fa = payload.locale === 'fa';
  const invalid = () => errorResponse(400, 'Please complete all required fields with valid values.', 'لطفاً همه موارد الزامی را کامل و معتبر وارد کنید.', fa);
  if (payload.website !== undefined && payload.website !== '') return invalid();
  const values: Record<string, string> = {};
  for (const [field, [min, max]] of Object.entries(fields)) {
    const value = payload[field] ?? '';
    if (typeof value !== 'string') return invalid();
    values[field] = value.trim();
    if (values[field].length < min || values[field].length > max || (field !== 'message' && /[\r\n\u0000]/.test(value))) return invalid();
  }
  if (!emailPattern.test(values.email) || typeof payload.topic !== 'string' || !Object.hasOwn(topicLabels, payload.topic)) return invalid();
  const config = getMailConfig();
  if (!config) return errorResponse(503, 'Online enquiries are temporarily unavailable. Please email info@krism-society.com.', 'ارسال آنلاین موقتاً در دسترس نیست. لطفاً به info@krism-society.com ایمیل بزنید.', fa);
  if (!allowAttempt(values.email)) return errorResponse(429, 'Please wait 15 minutes before sending another enquiry.', 'لطفاً پیش از ارسال درخواست دیگر ۱۵ دقیقه صبر کنید.', fa);

  const reference = `KRISM-${randomUUID().slice(0, 8).toUpperCase()}`;
  const transporter = nodemailer.createTransport(config.transport);
  try {
    const result = await transporter.sendMail({
      from: {name: 'KRISM website', address: config.sender},
      to: contactDetails.email,
      replyTo: {name: values.name, address: values.email},
      subject: `[${reference}] ${values.subject}`,
      text: [
        'New enquiry from the KRISM website', `Reference: ${reference}`, '',
        `Name: ${values.name}`, `Email: ${values.email}`, `Organization: ${values.organization || '—'}`,
        `Role / specialty: ${values.role || '—'}`, `Enquiry type: ${topicLabels[payload.topic]}`, `Language: ${fa ? 'Persian' : 'English'}`, '', values.message,
      ].join('\n'),
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    if (!result.accepted.some(address => String(address).toLowerCase() === contactDetails.email.toLowerCase())) throw new Error('Recipient not accepted');
    return NextResponse.json({ok: true, reference}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    // Do not log credentials, addresses, or message content.
    console.error('KRISM contact delivery failed; reference:', reference);
    return errorResponse(502, 'Delivery could not be confirmed. Please email info@krism-society.com rather than resubmitting.', 'تأیید ارسال ممکن نشد. لطفاً به‌جای ارسال مجدد فرم، به info@krism-society.com ایمیل بزنید.', fa);
  } finally {
    transporter.close();
  }
}

import fs from 'node:fs/promises';
import path from 'node:path';
import {createHmac, randomBytes, scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {NextResponse} from 'next/server';
import {atomicWrite, dataDirectory, withStoreLock} from './cms-store';
import {CmsError} from './cms-validation';

const derive = promisify(scrypt);
const cookieName = 'krism_owner';
const sessionSeconds = 8 * 60 * 60;
interface Owner {salt: string; hash: string; secret: string; createdAt: string}
const ownerPath = () => path.join(dataDirectory(), 'owner.json');
export async function readOwner(): Promise<Owner | null> {
  try {return JSON.parse(await fs.readFile(ownerPath(), 'utf8')) as Owner;} catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw new CmsError('storage_unavailable', 503);
  }
}
export function setupAllowed(request: Request) {
  const host = new URL(request.url).hostname;
  return process.env.NODE_ENV === 'development' && ['localhost','127.0.0.1','[::1]'].includes(host);
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const allowed = [url.origin];
  if (process.env.KRISM_SITE_URL) {try {allowed.push(new URL(process.env.KRISM_SITE_URL).origin);} catch {}}
  if (process.env.NODE_ENV === 'development') {
    for (const hostname of ['localhost','127.0.0.1','[::1]']) allowed.push(`${url.protocol}//${hostname}${url.port ? ':' + url.port : ''}`);
  }
  if (!origin || !allowed.includes(origin)) throw new CmsError('forbidden', 403);
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new CmsError('forbidden', 403);
}
export async function readBytes(request: Request, maxBytes: number): Promise<Buffer> {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new CmsError('too_large', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new CmsError('invalid_request');
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) {const {done, value} = await reader.read(); if (done) break; length += value.byteLength; if (length > maxBytes) {await reader.cancel(); throw new CmsError('too_large', 413);} chunks.push(value);}
  return Buffer.concat(chunks);
}
export async function readJson(request: Request, maxBytes = 512 * 1024): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new CmsError('invalid_request', 415);
  const bytes = await readBytes(request, maxBytes);
  try {const value: unknown = JSON.parse(bytes.toString('utf8')); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); return value as Record<string, unknown>;} catch {throw new CmsError('invalid_request');}
}
export async function createOwner(password: string) {
  if (password.length < 12 || password.length > 200) throw new CmsError('password_length');
  return withStoreLock(async () => {
    if (await readOwner()) throw new CmsError('already_configured', 409);
    const salt = randomBytes(32).toString('hex');
    const hash = (await derive(password, salt, 64) as Buffer).toString('hex');
    const owner = {salt, hash, secret: randomBytes(48).toString('hex'), createdAt: new Date().toISOString()};
    await atomicWrite(ownerPath(), owner); return owner;
  });
}
export async function checkPassword(owner: Owner, password: unknown) {
  if (typeof password !== 'string' || password.length > 200) return false;
  const actual = await derive(password, owner.salt, 64) as Buffer;
  const expected = Buffer.from(owner.hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export async function changePassword(current: unknown, password: unknown) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 200) throw new CmsError('password_length');
  return withStoreLock(async () => {
    const owner = await readOwner();
    if (!owner || !await checkPassword(owner, current)) throw new CmsError('wrong_password', 401);
    const salt = randomBytes(32).toString('hex');
    const next = {...owner, salt, hash:(await derive(password, salt, 64) as Buffer).toString('hex'), secret:randomBytes(48).toString('hex')};
    await atomicWrite(ownerPath(),next); return next;
  });
}
export function issueSession(response: NextResponse, owner: Owner) {
  const payload = Buffer.from(JSON.stringify({expires: Date.now() + sessionSeconds * 1000, nonce: randomBytes(16).toString('hex')})).toString('base64url');
  const signature = createHmac('sha256', owner.secret).update(payload).digest('base64url');
  response.cookies.set(cookieName, payload + '.' + signature, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: sessionSeconds});
}
export function clearSession(response: NextResponse) {response.cookies.set(cookieName, '', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0});}
export async function authenticated(request: Request) {
  const owner = await readOwner(); if (!owner) return false;
  const token = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!token || token.length > 1000) return false;
  const [payload, signature, extra] = token.split('.'); if (!payload || !signature || extra) return false;
  const expected = createHmac('sha256', owner.secret).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
  try {const claims = JSON.parse(Buffer.from(payload, 'base64url').toString()); return typeof claims.expires === 'number' && claims.expires > Date.now() && claims.expires <= Date.now() + sessionSeconds * 1000;} catch {return false;}
}
export async function requireOwner(request: Request) {if (!await authenticated(request)) throw new CmsError('unauthorized', 401);}
let loginWindow = {attempts: 0, expires: 0};
export function allowLogin() {
  if (Date.now() > loginWindow.expires) loginWindow = {attempts: 0, expires: Date.now() + 15 * 60 * 1000};
  if (++loginWindow.attempts > 12) throw new CmsError('rate_limited', 429);
}
export function json(data: unknown, status = 200) {return NextResponse.json(data, {status, headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow'}});}
export function failure(error: unknown) {return error instanceof CmsError ? json({error: error.code}, error.status) : json({error: 'storage_unavailable'}, 503);}

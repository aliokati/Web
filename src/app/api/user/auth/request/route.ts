import nodemailer from 'nodemailer';
import {NextResponse} from 'next/server';
import {getMailConfig} from '@/lib/contact-mail';
import {createLoginCode,isMemberEmail} from '@/lib/user-store';
import {requireSameOrigin} from '@/lib/cms-auth';
export const runtime='nodejs';
const emailPattern=/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
const attempts=new Map<string,{count:number;expires:number}>();
function allowed(email:string){const now=Date.now();const key=email;const entry=attempts.get(key);if(!entry||entry.expires<now){attempts.set(key,{count:1,expires:now+15*60*1000});return true;}if(entry.count>=3)return false;entry.count+=1;return true;}
export async function POST(request:Request){
  try{requireSameOrigin(request);const body=await request.json() as {email?:unknown;locale?:unknown};const email=String(body.email||'').trim().toLowerCase();const locale=body.locale==='fa'?'fa':'en';if(!emailPattern.test(email)||email.length>254)return NextResponse.json({error:'invalid_email'},{status:400});if(!isMemberEmail(email))return NextResponse.json({error:'member_email_required'},{status:403});if(!allowed(email))return NextResponse.json({error:'rate_limited'},{status:429,headers:{'Retry-After':'900'}});
    const config=getMailConfig();if(!config)return NextResponse.json({error:'mail_unavailable'},{status:503});const code=await createLoginCode(email,locale);const transport=nodemailer.createTransport(config.transport);
    await transport.sendMail({from:{name:'KRISM Sleep Hygiene',address:config.sender},to:email,subject:locale==='fa'?'کد ورود بهداشت خواب | KRISM':'Your KRISM Sleep Hygiene verification code',text:locale==='fa'?`کد ورود شما: ${code}\n\nاین کد تا ۱۰ دقیقه معتبر است و فقط یک‌بار قابل استفاده است\nاگر شما این درخواست را ارسال نکرده‌اید، این پیام را نادیده بگیرید`:`Your KRISM Sleep Hygiene verification code is: ${code}\n\nThis code expires in 10 minutes and can be used once\nIf you did not request it, you can ignore this email`,disableFileAccess:true,disableUrlAccess:true});transport.close();return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'request_failed'},{status:400});}
}

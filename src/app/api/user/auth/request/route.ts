import nodemailer from 'nodemailer';
import {NextResponse} from 'next/server';
import {getMailConfig} from '@/lib/contact-mail';
import {createLoginToken} from '@/lib/user-store';
import {requireSameOrigin} from '@/lib/cms-auth';
export const runtime='nodejs';
const emailPattern=/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
const attempts=new Map<string,{count:number;expires:number}>();
function allowed(email:string){const now=Date.now();const key=email;const entry=attempts.get(key);if(!entry||entry.expires<now){attempts.set(key,{count:1,expires:now+15*60*1000});return true;}if(entry.count>=3)return false;entry.count+=1;return true;}
export async function POST(request:Request){
  try{requireSameOrigin(request);const body=await request.json() as {email?:unknown;locale?:unknown};const email=String(body.email||'').trim().toLowerCase();const locale=body.locale==='fa'?'fa':'en';if(!emailPattern.test(email)||email.length>254)return NextResponse.json({error:'invalid_email'},{status:400});if(!allowed(email))return NextResponse.json({error:'rate_limited'},{status:429,headers:{'Retry-After':'900'}});
    const config=getMailConfig();if(!config)return NextResponse.json({error:'mail_unavailable'},{status:503});const token=await createLoginToken(email,locale);const base=process.env.KRISM_SITE_URL||new URL(request.url).origin;const link=`${base}/api/user/auth/verify?token=${encodeURIComponent(token)}`;const transport=nodemailer.createTransport(config.transport);
    await transport.sendMail({from:{name:'KRISM Sleep Hygiene',address:config.sender},to:email,subject:locale==='fa'?'ورود به پرتال بهداشت خواب KRISM':'Sign in to the KRISM Sleep Hygiene Portal',text:locale==='fa'?`برای ورود، این پیوند را تا ۱۵ دقیقه آینده باز کنید:\n${link}`:`Open this link within 15 minutes to sign in:\n${link}`,disableFileAccess:true,disableUrlAccess:true});transport.close();return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'request_failed'},{status:400});}
}

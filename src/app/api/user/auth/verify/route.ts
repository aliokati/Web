import {NextResponse} from 'next/server';
import {consumeLoginCode,consumeLoginToken,isMemberEmail,issueUserSession} from '@/lib/user-store';
import {requireSameOrigin} from '@/lib/cms-auth';
export const runtime='nodejs';
export async function POST(request:Request){
  try{
    requireSameOrigin(request);
    const body=await request.json() as {email?:unknown;code?:unknown};
    const email=String(body.email||'').trim().toLowerCase(); const code=String(body.code||'').trim();
    if(!isMemberEmail(email)||!/^[0-9]{6}$/.test(code))return NextResponse.json({error:'invalid_code'},{status:400});
    const result=await consumeLoginCode(email,code);
    if(!result.ok)return NextResponse.json({error:result.reason},{status:401});
    const response=NextResponse.json({ok:true,email:result.email}); await issueUserSession(response,result.email); return response;
  }catch{return NextResponse.json({error:'verify_failed'},{status:400});}
}
export async function GET(request:Request){const url=new URL(request.url);const result=await consumeLoginToken(url.searchParams.get('token')||'');if(!result)return NextResponse.redirect(new URL('/en/sleep-hygiene?login=expired',url.origin));const response=NextResponse.redirect(new URL(`/${result.locale}/sleep-hygiene?login=success`,url.origin));await issueUserSession(response,result.email);return response;}

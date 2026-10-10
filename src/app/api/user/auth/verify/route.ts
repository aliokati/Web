import {NextResponse} from 'next/server';
import {consumeLoginToken,issueUserSession} from '@/lib/user-store';
export const runtime='nodejs';
export async function GET(request:Request){const url=new URL(request.url);const result=await consumeLoginToken(url.searchParams.get('token')||'');if(!result)return NextResponse.redirect(new URL('/en/sleep-hygiene?login=expired',url.origin));const response=NextResponse.redirect(new URL(`/${result.locale}/sleep-hygiene?login=success`,url.origin));await issueUserSession(response,result.email);return response;}

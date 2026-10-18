import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import type {Locale} from '@/i18n/config';
import SleepHygieneHub from '@/components/sleep-hygiene/SleepHygieneHub';
import {currentUser,memberDisplayName} from '@/lib/user-store';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{locale:Locale}>}):Promise<Metadata>{
  const {locale}=await params;
  return {title:locale==='fa'?'بهداشت خواب | KRISM':'Sleep Hygiene | KRISM',description:locale==='fa'?'ابزارهای عملی، یادگیری کوتاه و مسیر شخصی برای بهداشت خواب':'Practical tools, concise learning and a personal path for sleep hygiene'};
}

export default async function SleepHygienePage({params}:{params:Promise<{locale:Locale}>}){
  const {locale}=await params;
  const cookieHeader=(await cookies()).toString();
  const user=await currentUser(new Request('http://internal.local',{headers:{cookie:cookieHeader}}));
  const member=user?{email:user.email,name:memberDisplayName(user.email)}:null;
  return <SleepHygieneHub locale={locale} member={member}/>;
}

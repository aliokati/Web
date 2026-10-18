import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import type {Locale} from '@/i18n/config';
import SleepHygieneApp from '@/components/sleep-hygiene/SleepHygieneApp';
import {currentUser,memberDisplayName} from '@/lib/user-store';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{locale:Locale}>}):Promise<Metadata>{
  const {locale}=await params;
  return {title:locale==='fa'?'اپ بهداشت خواب KRISM':'KRISM Sleep Hygiene App',description:locale==='fa'?'فضای شخصی و نصب‌پذیر بهداشت خواب KRISM':'The private, installable KRISM sleep hygiene app',manifest:'/pwa-manifest.webmanifest',appleWebApp:{capable:true,title:locale==='fa'?'بهداشت خواب KRISM':'KRISM Sleep Hygiene',statusBarStyle:'black-translucent'}};
}

export default async function SleepHygieneAppPage({params}:{params:Promise<{locale:Locale}>}){
  const {locale}=await params;
  const cookieHeader=(await cookies()).toString();
  const user=await currentUser(new Request('http://internal.local',{headers:{cookie:cookieHeader}}));
  return <SleepHygieneApp locale={locale} member={user?{email:user.email,name:memberDisplayName(user.email)}:null}/>;
}

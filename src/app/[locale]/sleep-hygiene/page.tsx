import type {Metadata} from 'next';
import {PageHero} from '@/components/site/Content';
import VelaAnnouncement from '@/components/sleep-hygiene/VelaAnnouncement';
import type {Locale} from '@/i18n/config';

export async function generateMetadata({params}:{params:Promise<{locale:Locale}>}):Promise<Metadata>{const {locale}=await params;return {title:locale==='fa'?'ولا | فضای خصوصی بازیابی':'VELA | Private recovery workspace',description:locale==='fa'?'معرفی کوتاه ولا؛ وب‌اپلیکیشن خصوصی و ممتاز KRISM برای خواب و بازیابی.':'A concise introduction to VELA, KRISM’s private premium recovery web app.',manifest:'/manifest.webmanifest'};}

export default async function SleepHygienePage({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;const fa=locale==='fa';return <main className="legacy-page sleep-portal vela-public-page"><PageHero eyebrow={fa?'ولا · تجربه ممتاز بازیابی':'VELA · PREMIUM RECOVERY EXPERIENCE'} title={fa?'فضای خصوصی شما برای خواب و بازیابی.':'Your private space for sleep and recovery.'} description={fa?'ولا را در یک فضای وب‌اپلیکیشن جداگانه تجربه کنید؛ این صفحه فقط معرفی کوتاه و مسیر ورود است.':'Experience VELA in a dedicated web-app workspace; this page is the public introduction and entry point.'}/><section className="section-space surface-mineral"><div className="page-wrap"><VelaAnnouncement locale={locale}/></div></section></main>}

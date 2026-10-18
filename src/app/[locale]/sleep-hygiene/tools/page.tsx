import type {Metadata} from 'next';
import Link from 'next/link';
import type {Locale} from '@/i18n/config';
import SleepTools from '@/components/sleep-hygiene/SleepTools';
import styles from '@/components/sleep-hygiene/SleepHygieneExperience.module.css';

export async function generateMetadata({params}:{params:Promise<{locale:Locale}>}):Promise<Metadata>{
  const {locale}=await params;
  return {title:locale==='fa'?'ابزارهای بهداشت خواب | KRISM':'Sleep Hygiene Tools | KRISM',description:locale==='fa'?'ابزارهای کاربردی برای زمان‌بندی خواب، محیط اتاق و عادت‌های شبانه':'Practical tools for sleep timing, bedroom preparation and evening habits'};
}

export default async function SleepToolsPage({params}:{params:Promise<{locale:Locale}>}){
  const {locale}=await params;const fa=locale==='fa';
  return <main className={styles.hub} dir={fa?'rtl':'ltr'}><section className={styles.hero}><div className={styles.frame}><p className={styles.eyebrow}><i/>{fa?'ابزارهای کاربردی':'PRACTICAL TOOLS'}</p><h1>{fa?'یک گام روشن برای امشب':'One clear step for tonight'}</h1><p className={styles.heroCopy}>{fa?'زمان‌بندی، اتاق خواب و نور را با ابزارهای کوچک و قابل ذخیره روی دستگاه خود تنظیم کنید':'Use small, device-saved tools to shape sleep timing, the bedroom and evening light'}</p><div className={styles.heroActions}><Link className={styles.secondary} href={`/${locale}/sleep-hygiene`}>{fa?'بازگشت به بهداشت خواب':'Back to Sleep Hygiene'}</Link></div></div></section><section className={styles.section}><div className={styles.frame}><SleepTools locale={locale}/><p className={styles.toolFoot}>{fa?'این ابزارها آموزشی هستند و تشخیص یا درمان پزشکی ارائه نمی‌کنند':'These tools are educational and do not provide medical diagnosis or treatment'}</p></div></section></main>;
}

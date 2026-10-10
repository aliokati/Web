import FollowUpTests from '@/components/sleep-check/FollowUpTests';
import {PageHero} from '@/components/site/Content';
import type {Locale} from '@/i18n/config';
import Link from 'next/link';
export default async function Page({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;const fa=locale==='fa';return <main className="legacy-page"><PageHero title={fa?'پرسش‌نامه‌های تکمیلی خواب':'Sleep follow-up questionnaires'}/><section className="section-space surface-mineral"><div className="page-wrap"><Link className="back-link" href={'/'+locale+'/sleep-check'}>{fa?'← بازگشت به ارزیابی عمومی':'← Back to the general sleep check'}</Link><FollowUpTests locale={locale}/></div></section></main>;}

import Link from 'next/link';
import {PageHero} from '@/components/site/Content';
import CollectionExplorer from '@/components/site/CollectionExplorer';
import {getRecords} from '@/lib/content';

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const fa = locale === 'fa';
  return <main className="legacy-page"><PageHero title={fa ? 'جامعه حرفه‌ای پزشکی خواب' : 'A community for sleep professionals'} description={fa ? 'آموزش، منابع و همکاری میان‌رشته‌ای در خراسان' : 'Education, resources and multidisciplinary collaboration across Khorasan'}/>
    <section className="section-space surface-mineral"><div className="page-wrap">
      <div className="hub-links">{[['network', 'Professional network', 'شبکه حرفه‌ای'], ['events', 'Learning & events', 'آموزش و رویدادها'], ['resources', 'Resources', 'منابع'], ['affiliations', 'Organizations & journals', 'سازمان‌ها و مجلات'], ['research', 'Research', 'پژوهش'], ['sleep-check/tracks', 'Questionnaires', 'پرسش‌نامه‌ها']].map(([route, en, persian]) => <Link key={route} href={`/${locale}/${route}`}>{fa ? persian : en} {fa ? '←' : '→'}</Link>)}</div>
      <h2 className="subsection-heading">{fa ? 'پروفایل‌های شورای پژوهشی' : 'Research board profiles'}</h2>
      <CollectionExplorer records={getRecords('board', locale)} section="board" locale={locale}/>
    </div></section></main>;
}

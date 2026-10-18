import Link from 'next/link';
import {PageHero} from '@/components/site/Content';
import ResearchHub from '@/components/site/ResearchHub';
import {getRecords} from '@/lib/content';

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const fa = locale === 'fa';
  return <main className="legacy-page"><PageHero title={fa ? 'پژوهش و دانش مشترک' : 'Research & shared knowledge'} description={fa ? 'پروژه‌ها و انتشارات را جستجو کنید و با جامعه پژوهشی پزشکی خواب آشنا شوید' : 'Explore projects and publications, and connect with the sleep research community'}/>
    <section className="section-space surface-mineral"><div className="page-wrap">
      <ResearchHub projects={getRecords('research', locale)} publications={getRecords('publications', locale)} locale={locale}/>
      <h2 className="subsection-heading">{fa ? 'ادامه مسیر پژوهشی' : 'Continue exploring'}</h2>
      <div className="hub-links">{[['research-board', 'Meet the research board', 'آشنایی با شورای پژوهشی'], ['affiliations', 'Scientific organizations & journals', 'سازمان‌ها و مجلات علمی'], ['resources', 'Learning resources', 'منابع آموزشی'], ['contact', 'Prepare a collaboration inquiry', 'آماده‌سازی درخواست همکاری']].map(([route, en, persian]) => <Link href={`/${locale}/${route}`} key={route}>{fa ? persian : en} {fa ? '←' : '→'}</Link>)}</div>
    </div></section></main>;
}

import {organizations, journals} from '@/content/affiliations';
import {PageHero} from '@/components/site/Content';
import ReferenceDirectory from '@/components/site/ReferenceDirectory';

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const fa = locale === 'fa';
  return <main className="legacy-page"><PageHero eyebrow={fa ? 'فهرست منابع علمی' : 'SCIENTIFIC DIRECTORY'} title={fa ? 'سازمان‌ها و مجلات علمی' : 'Organizations & journals.'} description={fa ? 'فهرست کامل منابع سازمانی و مجلات خواب؛ برای دسترسی به آموزش، پژوهش و جامعه علمی.' : 'The full directory of sleep organizations and journals, connecting you with education, research and the scientific community.'}/>
    <section className="section-space surface-mineral"><div className="page-wrap"><ReferenceDirectory organizations={organizations} journals={journals} locale={locale}/><p className="directory-disclaimer">{fa ? 'این فهرست شامل پیوندهای علمی منتخب است. درج نام یا پیوند یک نهاد به معنای وابستگی رسمی یا تأیید KRISM نیست.' : 'This directory contains selected scientific references. Inclusion does not imply a formal affiliation with, or endorsement by, KRISM.'}</p></div></section>
  </main>;
}

'use client';
import {useState} from 'react';
import {ArrowUpRight, Building2, BookOpen, Search} from 'lucide-react';
import type {ExternalReference} from '@/content/affiliations';

const normalize = (value: string) => value.toLocaleLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200d]/g, ' ').trim();
export default function ReferenceDirectory({organizations, journals, locale}: {organizations: ExternalReference[]; journals: ExternalReference[]; locale: string}) {
  const [query, setQuery] = useState('');
  const fa = locale === 'fa';
  const t = (en: string, persian: string) => fa ? persian : en;
  const number = (value: number) => new Intl.NumberFormat(fa ? 'fa' : 'en').format(value);
  const matches = (item: ExternalReference) => normalize([item.name, item.nameFa, item.short, item.description, item.descriptionFa, item.region, item.regionFa].join(' ')).includes(normalize(query));
  const groups = [
    {id: 'organizations', title: t('Scientific organizations', 'سازمان‌های علمی'), description: t('Professional societies, academies and public education resources.', 'انجمن‌های حرفه‌ای، آکادمی‌ها و منابع آموزش عمومی.'), items: organizations, icon: Building2},
    {id: 'journals', title: t('Sleep & circadian journals', 'مجلات خواب و ریتم شبانه‌روزی'), description: t('Clinical practice, fundamental science and population sleep health.', 'طب بالینی، علوم پایه و سلامت خواب جمعیت.'), items: journals, icon: BookOpen},
  ];
  return <>
    <div className="directory-toolbar"><label className="search-label"><span>{t('Search the full directory', 'جستجو در فهرست کامل')}</span><div className="directory-search"><Search size={18} aria-hidden="true"/><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t('Name, topic or region…', 'نام، موضوع یا منطقه…')}/></div></label>
      <nav className="directory-jumps" aria-label={t('Directory sections', 'بخش‌های فهرست')}><a href="#organizations">{t('Organizations', 'سازمان‌ها')}<span>{number(organizations.length)}</span></a><a href="#journals">{t('Journals', 'مجلات')}<span>{number(journals.length)}</span></a></nav>
    </div>
    <p className="result-count" role="status">{number([...organizations, ...journals].filter(matches).length)} {t('references', 'مرجع')}</p>
    {groups.map(({id, title, description, items, icon: Icon}) => {
      const visible = items.filter(matches);
      return <section id={id} key={id} className="reference-section" aria-labelledby={`${id}-heading`}>
        <div className="reference-section-heading"><span className="reference-section-icon"><Icon size={24} strokeWidth={1.5}/></span><div><p className="tech-label">{number(items.length)} {t('IN THE DIRECTORY', 'مرجع در فهرست')}</p><h2 id={`${id}-heading`}>{title}</h2><p>{description}</p></div></div>
        {visible.length ? <div className="record-grid reference-card-grid">{visible.map(item => <a className="content-card record-card reference-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.id}>
          <div className="reference-card-top"><span className="reference-initials" dir="ltr">{item.short}</span><ArrowUpRight size={20} aria-hidden="true"/></div>
          <h3>{fa ? item.nameFa : item.name}</h3><p>{fa ? item.descriptionFa : item.description}</p><div className="reference-card-bottom"><span>{fa ? item.regionFa : item.region}</span><span>{t('Visit website', 'مشاهده وب‌سایت')}</span></div>
        </a>)}</div> : <div className="directory-empty"><p>{t('No matches in this section.', 'در این بخش نتیجه‌ای یافت نشد.')}</p><button type="button" onClick={() => setQuery('')}>{t('Clear search', 'پاک کردن جستجو')}</button></div>}
      </section>;
    })}
  </>;
}

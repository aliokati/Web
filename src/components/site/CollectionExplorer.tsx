'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {RecordData} from '@/lib/content';

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200d]/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function CollectionExplorer({records, locale, section}: {records: RecordData[]; locale: string; section: string}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const fa = locale === 'fa';
  const profiles = section === 'board' || section === 'network';
  const categories = Array.from(new Set(records.map(record => record.category).filter(Boolean))) as string[];
  const visible = records.filter(record => {
    const searchable = [record.title, record.name, record.description, record.excerpt, record.specialty, record.institution, record.role, record.category].filter(Boolean).join(' ');
    return (category === 'all' || record.category === category) && normalize(searchable).includes(normalize(query));
  });
  const clear = () => {setQuery(''); setCategory('all');};
  return <>
    <div className="library-controls">
      <label className="search-label"><span>{profiles ? (fa ? 'جستجوی نام، تخصص یا دانشگاه' : 'Search by name, specialty or institution') : (fa ? 'جستجوی عنوان یا موضوع' : 'Search by title or topic')}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={fa ? 'عبارت جستجو…' : 'Type to search…'}/></label>
      {categories.length > 0 && <div className="filter-list" aria-label={fa ? 'دسته‌بندی' : 'Filter by category'}>{['all', ...categories].map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value === 'all' ? (fa ? 'همه موضوعات' : 'All topics') : value}</button>)}</div>}
    </div>
    <p className="result-count" role="status">{new Intl.NumberFormat(fa ? 'fa' : 'en').format(visible.length)} {profiles ? (fa ? 'پروفایل' : 'profiles') : (fa ? 'نتیجه' : 'results')}</p>
    {visible.length > 0 ? <div className="record-grid">{visible.map(record => <Link key={record.slug} href={`/${locale}/${section}/${record.slug}`} className="content-card record-card">
      {record.photo && <img className="profile-photo" src={record.photo.replace(/^\/public\//, '/')} alt={record.name || ''} width={120} height={140}/>}
      {(record.category || record.readTime) && <div className="card-meta"><span>{record.category}</span><span>{record.readTime}</span></div>}
      <h2>{record.title || record.name}</h2><p>{record.description || record.excerpt || record.role}</p>
      {record.specialty && <p>{record.specialty}</p>}{record.institution && <small>{record.institution}</small>}
      <span className="record-action">{profiles ? (fa ? 'مشاهده پروفایل ←' : 'View profile →') : (fa ? 'مطالعه بیشتر ←' : 'Read more →')}</span>
    </Link>)}</div> : <div className="empty-state">
      <h2>{records.length ? (fa ? 'نتیجه‌ای یافت نشد.' : 'No matching results.') : (fa ? 'هنوز موردی منتشر نشده است.' : 'No records published yet.')}</h2>
      <p>{records.length ? (fa ? 'عبارت دیگری را امتحان کنید یا فیلترها را پاک کنید.' : 'Try another search or clear the filters.') : (fa ? 'این بخش پس از تکمیل و بازبینی اطلاعات به‌روزرسانی می‌شود.' : 'This section will be updated as reviewed records become available.')}</p>
      {(query || category !== 'all') ? <button type="button" onClick={clear}>{fa ? 'پاک کردن جستجو و فیلترها' : 'Clear search and filters'}</button> : <Link href={`/${locale}/resources`}>{fa ? 'مشاهده منابع آموزشی ←' : 'Explore learning resources →'}</Link>}
    </div>}
  </>;
}

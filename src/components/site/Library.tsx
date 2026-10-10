'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {RecordData} from '@/lib/content';
export default function Library({items,locale}:{items:(RecordData&{section:string})[];locale:string}) {
 const [filter,setFilter]=useState('all'); const [query,setQuery]=useState(''); const fa=locale==='fa';
 const categories=Array.from(new Set(items.map(r=>r.category).filter(Boolean))) as string[];
 const records=items.filter(r=>(filter==='all'||r.category===filter)&&((r.title||'')+' '+(r.description||r.excerpt||'')).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 return <><div className="library-controls"><label className="search-label"><span>{fa?'جستجو در کتابخانه':'Search the library'}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={fa?'عنوان یا موضوع…':'Title or topic…'}/></label><div className="filter-list">{['all',...categories].map(category=><button key={category} onClick={()=>setFilter(category)} aria-pressed={filter===category}>{category==='all'?(fa?'همه موضوعات':'All topics'):category}</button>)}</div></div>
 <p className="result-count" aria-live="polite">{records.length} {fa?'مطلب':'articles'}</p><div className="record-grid">{records.map(record=><Link href={'/'+locale+'/'+record.section+'/'+record.slug} className="content-card record-card" key={record.section+record.slug}><div className="card-meta"><span>{record.category}</span><span>{record.readTime}</span></div><h2>{record.title}</h2><p>{record.description||record.excerpt}</p><span className="record-action">{fa?'مطالعه مطلب ←':'Read article →'}</span></Link>)}</div>{!records.length&&<p className="empty-state">{fa?'مطلبی یافت نشد.':'No articles match your search.'}</p>}</>;
}

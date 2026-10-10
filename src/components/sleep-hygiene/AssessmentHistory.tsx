'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import type {Locale} from '@/i18n/config';
import {readQuestionnaireResults, type AssessmentRecord} from '@/lib/questionnaire-client';

const labels:Record<string,{en:string;fa:string}>={psqi:{en:'PSQI · Sleep quality',fa:'PSQI · کیفیت خواب'},meq:{en:'MEQ · Chronotype',fa:'MEQ · تیپ زمانی'},irls:{en:'IRLS · Restless legs',fa:'IRLS · پاهای بی‌قرار'}};
export default function AssessmentHistory({locale}:{locale:Locale}){
 const fa=locale==='fa'; const [items,setItems]=useState<AssessmentRecord[]>([]);
 useEffect(()=>{setItems(readQuestionnaireResults());const on=()=>setItems(readQuestionnaireResults());window.addEventListener('storage',on);return()=>window.removeEventListener('storage',on)},[]);
 return <section className="assessment-history" id="reports"><div className="assessment-history-heading"><div><p className="tech-label">{fa?'گزارش‌های ذخیره‌شده':'SAVED REPORTS'}</p><h2>{fa?'نتیجه‌ها را در مسیر خود نگه دارید':'Keep your results in context'}</h2></div><p>{fa?'گزارش‌ها فقط روی همین دستگاه ذخیره می‌شوند و برای مرور بعدی آماده‌اند.':'Completed reports stay on this device so you can compare them with your diary and export them later.'}</p></div>{items.length?<div className="assessment-history-grid">{items.map(item=><article key={item.slug}><div><span>{labels[item.slug]?.[fa?'fa':'en']||item.slug.toUpperCase()}</span><time dateTime={item.completedAt}>{new Date(item.completedAt).toLocaleDateString(fa?'fa-IR':'en-US',{year:'numeric',month:'short',day:'numeric'})}</time></div><strong>{item.score}<small> / {item.maxScore}</small></strong><p>{fa?item.interpretationFa:item.interpretationEn}</p><Link href={`/${locale}/sleep-check/tracks/${item.slug}`}>{fa?'باز کردن مسیر ←':'Open track →'}</Link></article>)}</div>:<div className="assessment-history-empty"><span>01</span><p>{fa?'هنوز گزارشی ذخیره نشده است. پس از تکمیل PSQI، MEQ یا IRLS، نتیجه اینجا ظاهر می‌شود.':'No saved reports yet. Complete PSQI, MEQ, or IRLS and the result will appear here.'}</p><Link href={`/${locale}/sleep-check/tracks`}>{fa?'انتخاب پرسشنامه':'Choose a questionnaire'} →</Link></div>}</section>;
}

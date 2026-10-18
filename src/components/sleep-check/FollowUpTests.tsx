import Link from 'next/link';
import type {Category} from '@/lib/sleep-guide';
import {followUpTracks,relatedTrackSlugs} from '@/config/followUpTracks';
import {questionnaireRegistry} from '@/config/questionnaireRegistry';

export default function FollowUpTests({locale,scores={},primary}:{locale:'en'|'fa';scores?:Partial<Record<Category,number>>;primary?:Category}){
  const fa=locale==='fa';
  const related=relatedTrackSlugs(scores,primary);
  const available=followUpTracks.filter(track=>questionnaireRegistry.find(item=>item.slug===track.slug)?.status==='verified').sort((a,b)=>Number(related.includes(b.slug))-Number(related.includes(a.slug)));
  return <section className="followup-tests" aria-labelledby="followup-heading"><h2 id="followup-heading">{fa?'پرسش‌نامه‌های تخصصی تکمیلی':'Detailed follow-up questionnaires'}</h2><p>{fa?'فقط مسیرهایی با مجموعه پرسش‌ها و منطق گزارش بازبینی‌شده در اینجا نمایش داده می‌شوند':'Only tracks with reviewed question sets and report logic are shown here'}</p><div className="followup-grid">{available.map(track=><Link key={track.slug} href={'/'+locale+'/sleep-check/tracks/'+track.slug} className={'followup-card'+(related.includes(track.slug)?' is-related':'')}><span className="followup-code" dir="ltr">{track.code}</span><h3>{fa?track.fa:track.en}</h3>{related.includes(track.slug)&&<span className="followup-related">{fa?'مرتبط با پاسخ‌های شما':'Related to your answers'}</span>}<span className="followup-action">{fa?'شروع پرسش‌نامه ←':'Open questionnaire →'}</span></Link>)}</div></section>;
}

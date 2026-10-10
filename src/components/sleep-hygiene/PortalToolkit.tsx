'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import type {Locale} from '@/i18n/config';

type Props={locale:Locale};

function minutesBetween(start:string,end:string){
  if(!start||!end)return null;
  const [sh,sm]=start.split(':').map(Number); const [eh,em]=end.split(':').map(Number);
  let value=(eh*60+em)-(sh*60+sm); if(value<=0)value+=1440; return value;
}

export default function PortalToolkit({locale}:Props){
  const fa=locale==='fa';
  const [wake,setWake]=useState('07:00');
  const [bed,setBed]=useState('23:00');
  const [windDown,setWindDown]=useState(30);
  const duration=useMemo(()=>minutesBetween(bed,wake),[bed,wake]);
  const outdoor=useMemo(()=>{if(!wake)return ''; const [h,m]=wake.split(':').map(Number); const total=(h*60+m+30)%1440; return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`},[wake]);
  return <section className="portal-toolkit" id="toolkit">
    <div className="toolkit-heading"><div><p className="tech-label">{fa?'ابزارهای هوشمند':'SMART TOOLS'}</p><h2>{fa?'قدم بعدی را همین حالا انتخاب کنید':'Make the next step easy'}</h2></div><p>{fa?'سه ابزار کوچک برای تبدیل توصیه‌ها به برنامه‌ای قابل اجرا.':'Three compact tools that turn good advice into an action you can use tonight.'}</p></div>
    <div className="toolkit-grid">
      <article className="toolkit-card toolkit-card-dark"><span className="tool-index">01</span><h3>{fa?'آماده‌سازی خواب':'Wind-down cue'}</h3><p>{fa?'زمان شروع آرام‌سازی را از ساعت خواب خود عقب بکشید.':'Choose a quiet transition before your intended bedtime.'}</p><div className="tool-row"><label>{fa?'ساعت خواب':'Bedtime'}<input type="time" value={bed} onChange={e=>setBed(e.target.value)}/></label><label>{fa?'مدت':'Length'}<select value={windDown} onChange={e=>setWindDown(Number(e.target.value))}><option value={20}>20 min</option><option value={30}>30 min</option><option value={60}>60 min</option></select></label></div><strong className="tool-output">{bed ? `${Math.floor(((Number(bed.slice(0,2))*60+Number(bed.slice(3))-windDown+1440)%1440)/60).toString().padStart(2,'0')}:${(((Number(bed.slice(0,2))*60+Number(bed.slice(3))-windDown+1440)%1440)%60).toString().padStart(2,'0')}` : '—'}</strong><small>{fa?'از این ساعت، نور و فعالیت را کم کنید.':'Start dimming light and activity at this time.'}</small></article>
      <article className="toolkit-card"><span className="tool-index">02</span><h3>{fa?'نور صبحگاهی':'Morning light'}</h3><p>{fa?'نور طبیعی صبح به تثبیت ریتم شبانه‌روزی کمک می‌کند.':'A short outdoor light window helps anchor your body clock.'}</p><label className="tool-wide-label">{fa?'ساعت بیداری':'Wake time'}<input type="time" value={wake} onChange={e=>setWake(e.target.value)}/></label><strong className="tool-output tool-output-light">{outdoor||'—'}</strong><small>{fa?'هدف پیشنهادی برای شروع نور طبیعی':'Suggested start for outdoor light'}</small></article>
      <article className="toolkit-card"><span className="tool-index">03</span><h3>{fa?'فرصت خواب':'Sleep opportunity'}</h3><p>{fa?'ببینید فاصله بین خواب و بیداری شما چقدر است؛ کیفیت خواب را جداگانه دنبال کنید.':'See your planned sleep window; track sleep quality separately in the diary.'}</p><div className="tool-row"><label>{fa?'خواب':'Bed'}<input type="time" value={bed} onChange={e=>setBed(e.target.value)}/></label><label>{fa?'بیداری':'Wake'}<input type="time" value={wake} onChange={e=>setWake(e.target.value)}/></label></div><strong className="tool-output tool-output-light">{duration===null?'—':`${Math.floor(duration/60)}h ${duration%60}m`}</strong><small>{fa?'یک بازه ثابت را چند شب امتحان کنید.':'Try keeping a consistent window for several nights.'}</small></article>
    </div>
    <div className="toolkit-next"><div><p className="tech-label">{fa?'مسیر پیشنهادی':'RECOMMENDED PATH'}</p><h3>{fa?'از آگاهی به عمل':'From insight to action'}</h3><p>{fa?'یک ابزار را انتخاب کنید، هفت روز ثبت کنید، سپس نتیجه را با یک پرسشنامه بررسی کنید.':'Choose one tool, track it for seven days, then review the change with a questionnaire.'}</p></div><div className="toolkit-next-links"><Link href={`/${locale}/sleep-hygiene/tools`}>{fa?'همه ابزارها ←':'Open all tools →'}</Link><Link href={`/${locale}/sleep-check`}>{fa?'شروع ارزیابی ←':'Start an assessment →'}</Link></div></div>
  </section>;
}
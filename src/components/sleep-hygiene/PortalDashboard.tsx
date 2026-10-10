'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import type {Locale} from '@/i18n/config';

type Props={locale:Locale};
const workspaceKey='krism-sleep-workspace-v1';
const learningKey='krism-learning-progress-v1';
export default function PortalDashboard({locale}:Props){
 const fa=locale==='fa'; const [habits,setHabits]=useState(0); const [lessons,setLessons]=useState(0); const [hasDiary,setHasDiary]=useState(false);
 useEffect(()=>{try{const w=JSON.parse(localStorage.getItem(workspaceKey)||'{}');setHabits(Array.isArray(w.checklist)?w.checklist.filter(Boolean).length:0);setHasDiary(Array.isArray(w.diary)&&w.diary.some((row:{bed?:string;wake?:string})=>row.bed&&row.wake));const l=JSON.parse(localStorage.getItem(learningKey)||'{}');setLessons(Object.values(l).filter(Boolean).length)}catch{}},[]);
 const progress=useMemo(()=>Math.min(100,Math.round(((habits/6)+(lessons/6)+(hasDiary?1:0))/3*100)),[habits,lessons,hasDiary]);
 return <section className="portal-dashboard" id="today" aria-label={fa?'داشبورد امروز':'Today dashboard'}>
  <div className="dashboard-glow" aria-hidden="true"/><div className="dashboard-main"><div className="dashboard-kicker"><span className="live-dot"/> {fa?'فضای شخصی شما':'YOUR PRIVATE SPACE'}</div><h2>{fa?'امشب فقط یک قدم.':'Tonight, keep it simple.'}</h2><p>{fa?'یک ابزار را انتخاب کنید، یک تغییر کوچک بسازید و اجازه دهید داده‌ها مسیر بعدی را روشن کنند.':'Choose one tool, make one small change, and let your data guide the next step.'}</p><div className="dashboard-actions"><Link className="dashboard-primary" href="#toolkit">{fa?'انتخاب ابزار':'Choose a tool'} <span>↗</span></Link><Link className="dashboard-secondary" href="#workspace">{fa?'ادامه دفترچه':'Continue diary'} <span>→</span></Link></div></div><div className="dashboard-progress"><div className="progress-ring" style={{'--progress':`${progress}%`} as React.CSSProperties}><div><strong>{progress}</strong><small>%</small></div></div><span>{fa?'پیشرفت مسیر':'PATH PROGRESS'}</span><b>{fa?`${habits} عادت · ${lessons} درس`:`${habits} habits · ${lessons} lessons`}</b></div>
  <div className="dashboard-route"><span className="route-label">{fa?'مسیر امشب':'TONIGHT’S ROUTE'}</span><div className={habits?'route-step done':'route-step'}><i>01</i><span>{fa?'بررسی':'Check'}</span><small>{fa?'یک دقیقه':'1 min'}</small></div><div className={lessons?'route-step done':'route-step'}><i>02</i><span>{fa?'یادگیری':'Learn'}</span><small>{fa?'سه دقیقه':'3 min'}</small></div><div className={hasDiary?'route-step done':'route-step'}><i>03</i><span>{fa?'ثبت':'Track'}</span><small>{fa?'هفت شب':'7 nights'}</small></div><div className="route-step"><i>04</i><span>{fa?'مرور':'Review'}</span><small>{fa?'هر هفته':'Weekly'}</small></div></div>
 </section>;
}

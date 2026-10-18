'use client';

import {useEffect, useMemo, useState} from 'react';
import {Bell, BookOpen, CalendarDays, Check, ChevronRight, Cloud, CloudOff, Download, Home, Lightbulb, LockKeyhole, MoonStar, RefreshCcw, Settings, Sparkles, Sunrise, UserRound} from 'lucide-react';
import type {Locale} from '@/i18n/config';
import SleepLoginModal from './SleepLoginModal';
import {formatDuration, sleepDurationMinutes, type SleepFocus, useSleepCompanion} from './useSleepCompanion';
import styles from './SleepHygieneExperience.module.css';

type Member={email:string;name:string};
type Tab='today'|'sleep'|'insights'|'learn'|'you';
type InstallEvent=Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
type Props={locale:Locale;member:Member|null};

const tabs:Tab[]=['today','sleep','insights','learn','you'];

export default function SleepHygieneApp({locale,member}:Props){
  const fa=locale==='fa';
  const [tab,setTab]=useState<Tab>('today');
  const [loginOpen,setLoginOpen]=useState(false);
  const [online,setOnline]=useState(true);
  const [installEvent,setInstallEvent]=useState<InstallEvent|null>(null);
  const [installHelp,setInstallHelp]=useState(false);
  const [bedtime,setBedtime]=useState('23:00');
  const [wake,setWake]=useState('07:00');
  const [quality,setQuality]=useState(3);
  const {data,ready,metrics,syncStatus,setFocus,setPlan,toggleHabit,toggleLesson,saveCheckin,sync,clearDevice}=useSleepCompanion(member?.email);
  const todayFocus:Record<SleepFocus,{en:string;fa:string;enText:string;faText:string}>={
    routine:{en:'Protect a short wind-down',fa:'زمان کوتاهی برای آرام‌سازی نگه دارید',enText:'Choose a small step that helps the day end more gently',faText:'یک گام کوچک انتخاب کنید که پایان روز را آرام‌تر کند'},
    timing:{en:'Let light lead the rhythm',fa:'اجازه دهید نور ریتم را هدایت کند',enText:'Seek daylight early and reduce bright light as night approaches',faText:'نور روز را زودتر ببینید و با نزدیک شدن شب نور شدید را کم کنید'},
    room:{en:'Make the room a cue for sleep',fa:'اتاق را نشانه‌ای برای خواب کنید',enText:'Lower stimulation before you ask your body to settle',faText:'پیش از انتظار برای خواب، محرک‌های اتاق را کم کنید'},
    learn:{en:'Learn one thing, try one thing',fa:'یک نکته یاد بگیرید و یک کار انجام دهید',enText:'Keep only what you can test tonight',faText:'فقط چیزی را نگه دارید که امشب بتوانید امتحان کنید'},
  };
  const current=todayFocus[data.focus];
  const lessons=fa?[
    {id:'light',title:'نور و ساعت بدن',text:'زمان نور می‌تواند بر زمان آمادگی برای خواب اثر بگذارد',icon:Sunrise},
    {id:'pressure',title:'فشار خواب',text:'زمان بیداری و زمان چرت بر خواب شب اثر می‌گذارند',icon:MoonStar},
    {id:'consistency',title:'ثبات قابل ادامه',text:'یک تغییر کوچک پایدار از برنامه سخت بهتر است',icon:RefreshCcw},
  ]:[
    {id:'light',title:'Light and the body clock',text:'The timing of light can affect when you feel ready for sleep',icon:Sunrise},
    {id:'pressure',title:'Sleep pressure',text:'Time awake and the timing of naps can affect the night',icon:MoonStar},
    {id:'consistency',title:'Repeatable consistency',text:'One small steady change beats an unsustainable plan',icon:RefreshCcw},
  ];
  const habitLabels=fa?['نور روز را زودتر می‌بینم','کافئین را زودتر تمام می‌کنم','برای آرام‌سازی فضا می‌گذارم','اتاق را کم‌تحریک می‌کنم','زمان بیداری را حفظ می‌کنم']:['I get daylight early','I finish caffeine earlier','I leave room to wind down','I lower stimulation in the room','I protect my wake time'];
  const recent=metrics.recent;
  const averageLabel=formatDuration(metrics.average,locale);
  const checkinTime=formatDuration(sleepDurationMinutes(bedtime,wake),locale);
  const tabCopy:Record<Tab,{en:string;fa:string;icon:typeof Home}>={today:{en:'Today',fa:'امروز',icon:Home},sleep:{en:'Sleep',fa:'خواب',icon:MoonStar},insights:{en:'Insights',fa:'بینش',icon:Sparkles},learn:{en:'Learn',fa:'یادگیری',icon:BookOpen},you:{en:'You',fa:'شما',icon:UserRound}};

  useEffect(()=>{
    document.body.classList.add('sleep-app-mode');
    setOnline(navigator.onLine);
    const onOnline=()=>setOnline(true);const onOffline=()=>setOnline(false);
    window.addEventListener('online',onOnline);window.addEventListener('offline',onOffline);
    const onInstall=(event:Event)=>{event.preventDefault();setInstallEvent(event as InstallEvent)};
    window.addEventListener('beforeinstallprompt',onInstall);
    const hostname=window.location.hostname;
    if(hostname.startsWith('pwa.'))navigator.serviceWorker.register('/pwa-sw.js',{scope:'/'}).catch(()=>undefined);
    return()=>{document.body.classList.remove('sleep-app-mode');window.removeEventListener('online',onOnline);window.removeEventListener('offline',onOffline);window.removeEventListener('beforeinstallprompt',onInstall)};
  },[]);
  async function install(){if(!installEvent){setInstallHelp(true);return}await installEvent.prompt();const choice=await installEvent.userChoice;if(choice.outcome==='accepted'){setInstallEvent(null);setInstallHelp(false)}}
  function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='krism-sleep-practice.json';anchor.click();URL.revokeObjectURL(url)}
  function saveToday(){saveCheckin({bedtime,wake,quality,focus:data.focus});setTab('insights')}
  const insight=useMemo(()=>{
    if(recent.length<3)return fa?'برای دیدن یک الگو، چند شب دیگر ثبت کنید':'Add a few more nights before drawing a pattern';
    if(metrics.quality!==null&&metrics.quality>=4)return fa?'استراحت ثبت‌شده شما نسبتاً خوب است، همین ریتم را ساده نگه دارید':'Your recorded rest is fairly strong, keep the rhythm simple';
    return fa?'به جای تغییر همه‌چیز، فقط یک نشانه شبانه را این هفته آزمایش کنید':'Rather than changing everything, test one evening cue this week';
  },[fa,metrics.quality,recent.length]);
  return <main className={styles.appShell} dir={fa?'rtl':'ltr'}><div className={styles.appViewport}>
    <header className={styles.appTop}><div className={styles.appBrand}><div className={styles.appBrandMark}><MoonStar size={18}/></div><div><span>{fa?'بهداشت خواب KRISM':'KRISM SLEEP HYGIENE'}</span><strong>{fa?'فضای شخصی خواب':'Sleep practice'}</strong></div></div><button className={styles.appIconButton} type="button" onClick={()=>setTab('you')} aria-label={fa?'تنظیمات':'Settings'}><Settings size={17}/></button></header>
    {!online&&<div className={styles.appOffline}><CloudOff size={13}/> {fa?'آفلاین هستید، ثبت‌ها روی دستگاه باقی می‌ماند':'You are offline, entries remain on this device'}</div>}
    {tab==='today'&&<>
      <div className={styles.appGreeting}><p>{fa?'امروز برای شما':'TODAY FOR YOU'}</p><h1>{member?(fa?`خوش آمدید ${member.name}`:`Welcome back, ${member.name}`):(fa?'شب آرام‌تر از یک گام شروع می‌شود':'A calmer night starts with one step')}</h1></div>
      <section className={`${styles.appCard} ${styles.appFocus}`}><span>{fa?'تمرکز انتخاب‌شده':'YOUR SELECTED FOCUS'}</span><h2>{current[fa?'fa':'en']}</h2><p>{current[fa?'faText':'enText']}</p><button type="button" onClick={()=>setTab(data.focus==='learn'?'learn':'sleep')}>{fa?'ادامه این گام':'Continue this step'} <ChevronRight size={14}/></button></section>
      <div className={styles.appStatRow}><div className={styles.appStat}><strong>{metrics.habitCount}/5</strong><span>{fa?'عادت امشب':'tonight habits'}</span></div><div className={styles.appStat}><strong>{recent.length}/7</strong><span>{fa?'شب ثبت‌شده':'nights logged'}</span></div><div className={styles.appStat}><strong>{metrics.quality??'—'}</strong><span>{fa?'کیفیت استراحت':'rest quality'}</span></div></div>
      <div className={styles.appSectionTitle}><h2>{fa?'چک سریع امشب':'Tonight’s quick check'}</h2><button type="button" onClick={()=>setTab('sleep')}>{fa?'جزئیات':'Details'}</button></div><section className={styles.appCard}><div className={styles.appFormGrid}><label className={styles.appField}>{fa?'خواب':'Bed'}<input type="time" value={bedtime} onChange={event=>setBedtime(event.target.value)}/></label><label className={styles.appField}>{fa?'بیداری':'Wake'}<input type="time" value={wake} onChange={event=>setWake(event.target.value)}/></label></div><div className={styles.appSectionTitle}><h2>{fa?'استراحت':'Restfulness'}</h2><span>{quality}/5</span></div><div className={styles.appSegment}>{[1,2,3,4,5].map(value=><button key={value} type="button" aria-pressed={quality===value} onClick={()=>setQuality(value)}>{value}</button>)}</div><div className={styles.appSectionTitle}><span>{fa?`بازه خواب ${checkinTime}`:`Sleep window ${checkinTime}`}</span><button type="button" onClick={saveToday}>{fa?'ذخیره':'Save'} <Check size={13}/></button></div></section>
    </>}
    {tab==='sleep'&&<>
      <div className={styles.appGreeting}><p>{fa?'برنامه خواب':'SLEEP PLAN'}</p><h1>{fa?'شب را ساده آماده کنید':'Prepare the night simply'}</h1></div>
      <section className={styles.appCard}><div className={styles.appSegment}>{(['routine','timing','room','learn'] as SleepFocus[]).map(focus=><button key={focus} type="button" aria-pressed={data.focus===focus} onClick={()=>setFocus(focus)}>{todayFocus[focus][fa?'fa':'en']}</button>)}</div><div className={styles.appSectionTitle}><h2>{fa?'چک‌لیست امشب':'Tonight’s checklist'}</h2><span>{metrics.habitCount}/5</span></div>{habitLabels.map((habit,index)=><label className={styles.appHabit} key={habit}><input type="checkbox" checked={data.habits[index]} onChange={()=>toggleHabit(index)}/><span>{habit}</span></label>)}</section>
      <div className={styles.appSectionTitle}><h2>{fa?'تعهد کوتاه':'Small commitment'}</h2></div><section className={styles.appCard}><label className={styles.appField}>{fa?'فقط یک تغییر که این هفته انجام می‌دهید':'The one change you will carry this week'}<textarea value={data.plan} onChange={event=>setPlan(event.target.value)} placeholder={fa?'مثلاً هر روز ساعت ۷ بیدار می‌شوم':'For example, I will wake at 7:00 each day'}/></label></section>
    </>}
    {tab==='insights'&&<>
      <div className={styles.appGreeting}><p>{fa?'مرور روند':'YOUR PATTERN'}</p><h1>{fa?'به هفته نگاه کنید':'See the week, gently'}</h1></div><section className={styles.appCard}><div className={styles.appChart}>{Array.from({length:7},(_,index)=>{const row=recent[index];const duration=row?sleepDurationMinutes(row.bedtime,row.wake):0;return <div className={styles.appBar} key={index}><i style={{height:duration?`${Math.max(12,Math.min(100,Math.round(duration/600*100)))}%`:'8%'}}/><span>{fa?`ش${index+1}`:`D${index+1}`}</span></div>})}</div><div className={styles.appStatRow}><div className={styles.appStat}><strong>{averageLabel}</strong><span>{fa?'بازه میانگین':'average window'}</span></div><div className={styles.appStat}><strong>{metrics.quality??'—'}</strong><span>{fa?'کیفیت میانگین':'average rest'}</span></div><div className={styles.appStat}><strong>{recent.length}</strong><span>{fa?'نمونه ثبت‌شده':'recorded nights'}</span></div></div><p className={styles.appInsight}>{insight}</p></section><div className={styles.appSectionTitle}><h2>{fa?'ثبت‌های اخیر':'Recent entries'}</h2></div><section className={styles.appCard}>{recent.length?recent.slice().reverse().map(row=><div className={styles.appProfileRow} key={row.date}><div><strong>{new Date(`${row.date}T12:00:00`).toLocaleDateString(fa?'fa-IR':'en-US',{weekday:'short',month:'short',day:'numeric'})}</strong><p>{row.bedtime} → {row.wake}</p></div><b>{row.quality}/5</b></div>):<p className={styles.appInsight}>{fa?'هنوز ثبتی ندارید، اولین شب را از بخش امروز ثبت کنید':'No entries yet, log the first night from Today'}</p>}</section>
    </>}
    {tab==='learn'&&<>
      <div className={styles.appGreeting}><p>{fa?'یادگیری کوتاه':'LEARN IN MINUTES'}</p><h1>{fa?'یک نکته را آزمایش کنید':'Try one useful idea'}</h1></div><section className={styles.appCard}>{lessons.map(lesson=>{const done=data.completedLessons.includes(lesson.id);const Icon=lesson.icon;return <article className={styles.appLesson} key={lesson.id}><div className={styles.appLessonIcon}><Icon size={17}/></div><div><h3>{lesson.title}</h3><p>{lesson.text}</p><button type="button" onClick={()=>toggleLesson(lesson.id)}>{done?(fa?'یاد گرفتم ✓':'Learned ✓'):(fa?'علامت‌گذاری':'Mark as learned')}</button></div></article>})}</section><div className={styles.appSectionTitle}><h2>{fa?'پرسش‌نامه‌های خواب':'Sleep questionnaires'}</h2><button type="button" onClick={()=>window.location.assign(`/${locale}/sleep-check/tracks`)}>{fa?'مشاهده':'Explore'}</button></div><section className={styles.appCard}><p className={styles.appInsight}>{fa?'اگر می‌خواهید یک نگرانی خاص را دقیق‌تر بررسی کنید، از پرسش‌نامه‌های معتبر KRISM استفاده کنید':'When you want to explore a specific concern, use the validated KRISM questionnaires'}</p></section>
    </>}
    {tab==='you'&&<>
      <div className={styles.appGreeting}><p>{fa?'حساب و داده':'ACCOUNT & DATA'}</p><h1>{member?(fa?`${member.name}، داده‌های شما`:`${member.name}, your data`):(fa?'فضای شما، انتخاب شما':'Your space, your choice')}</h1></div><section className={styles.appCard}><div className={styles.appProfileRow}><div><strong>{member?(fa?'عضو KRISM':'KRISM member'):(fa?'فضای روی دستگاه':'Device-only space')}</strong><p>{member?member.email:(fa?'می‌توانید بدون ورود هم ادامه دهید':'You can continue without signing in')}</p></div>{member?<Cloud size={18}/>:<LockKeyhole size={18}/>}</div>{member?<><div className={styles.appProfileRow}><div><strong>{fa?'همگام‌سازی':'Sync progress'}</strong><p>{syncStatus==='saved'?(fa?'نسخه حساب به‌روزرسانی شد':'Account version updated'):syncStatus==='restored'?(fa?'نسخه حساب بازیابی شد':'Account version restored'):syncStatus==='syncing'?(fa?'در حال همگام‌سازی':'Syncing now'):(fa?'هر زمان که می‌خواهید':'Whenever you choose')}</p></div><button type="button" onClick={()=>sync()}>{fa?'همگام‌سازی':'Sync'}</button></div></>:<div className={styles.appProfileRow}><div><strong>{fa?'ورود اعضا':'Member sign in'}</strong><p>{fa?'با نام کاربری KRISM':'With your KRISM username'}</p></div><button type="button" onClick={()=>setLoginOpen(true)}>{fa?'ورود':'Sign in'}</button></div>}<div className={styles.appProfileRow}><div><strong>{fa?'نسخه پشتیبان دستگاه':'Device backup'}</strong><p>{fa?'یک نسخه JSON قابل انتقال بسازید':'Create a portable JSON copy'}</p></div><button type="button" onClick={exportData}><Download size={14}/></button></div><div className={styles.appProfileRow}><div><strong>{fa?'شروع دوباره روی این دستگاه':'Start over on this device'}</strong><p>{fa?'فقط داده محلی را پاک می‌کند':'Clears local data only'}</p></div><button type="button" onClick={()=>{if(window.confirm(fa?'داده‌های این دستگاه پاک شود؟':'Clear data stored on this device?'))clearDevice()}}>{fa?'پاک‌سازی':'Clear'}</button></div></section></>
    }
    {!ready&&<div className={styles.appOffline}>{fa?'در حال آماده‌سازی فضای شما':'Preparing your space'}</div>}
    {(installEvent||installHelp)&&<aside className={styles.appInstall}><span>{installHelp?(fa?'از منوی مرورگر، گزینه نصب یا افزودن به صفحه اصلی را انتخاب کنید':'Use your browser menu to install or add this app to the home screen'):(fa?'این فضای شخصی را به صورت اپ نصب کنید':'Install this private space as an app')}</span><button type="button" onClick={install}>{installHelp?(fa?'متوجه شدم':'Got it'):(fa?'نصب':'Install')}</button></aside>}
    <nav className={styles.appNav} aria-label={fa?'ناوبری اپ':'App navigation'}>{tabs.map(item=>{const Icon=tabCopy[item].icon;return <button type="button" key={item} aria-current={tab===item?'page':undefined} onClick={()=>setTab(item)}><Icon size={17}/><span>{tabCopy[item][fa?'fa':'en']}</span></button>})}</nav>
  </div><SleepLoginModal locale={locale} open={loginOpen} onClose={()=>setLoginOpen(false)}/></main>;
}

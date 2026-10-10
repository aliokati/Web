'use client';

import {FormEvent, useEffect, useMemo, useState} from 'react';
import type {Locale} from '@/i18n/config';

type QuickEntry = {
  id: string;
  createdAt: string;
  mood: number;
  energy: number;
  stress: number;
  caffeine: boolean;
  note: string;
};

type LabId = 'light' | 'caffeine' | 'winddown';
type LabState = {id: LabId; startedAt: string; duration: number; checks: string[]};

const quickLogKey = 'krism-quick-log-v1';
const labKey = 'krism-personal-lab-v1';

const labOptions: Record<LabId, {en: string; fa: string; copyEn: string; copyFa: string; duration: number}> = {
  light: {en: 'Morning light', fa: 'نور صبحگاهی', copyEn: 'Get outside for 10 minutes within an hour of waking.', copyFa: 'در یک ساعت اول بیداری، ۱۰ دقیقه بیرون از خانه نور بگیرید.', duration: 7},
  caffeine: {en: 'Caffeine boundary', fa: 'مرز کافئین', copyEn: 'Keep caffeine at least 8 hours away from your planned bedtime.', copyFa: 'کافئین را حداقل ۸ ساعت قبل از زمان خواب برنامه‌ریزی‌شده متوقف کنید.', duration: 7},
  winddown: {en: 'Gentle landing', fa: 'فرود آرام', copyEn: 'Protect a 20-minute low-light wind-down before bed.', copyFa: '۲۰ دقیقه پیش از خواب را با نور کم و فعالیت آرام محافظت کنید.', duration: 7},
};

function readEntries(): QuickEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(quickLogKey) || '[]');
    return Array.isArray(parsed) ? parsed.filter((entry): entry is QuickEntry => entry && typeof entry.id === 'string') : [];
  } catch {
    return [];
  }
}

function readLab(): LabState | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(labKey) || 'null');
    return parsed && typeof parsed.id === 'string' ? parsed as LabState : null;
  } catch {
    return null;
  }
}

export default function VelaExperience({locale}: {locale: Locale}) {
  const fa = locale === 'fa';
  const [entries, setEntries] = useState<QuickEntry[]>([]);
  const [lab, setLab] = useState<LabState | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [caffeine, setCaffeine] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    setEntries(readEntries());
    setLab(readLab());
  }, []);

  const averages = useMemo(() => {
    const recent = entries.slice(0, 7);
    if (!recent.length) return null;
    const average = (key: 'mood' | 'energy' | 'stress') => recent.reduce((sum, entry) => sum + entry[key], 0) / recent.length;
    return {mood: average('mood'), energy: average('energy'), stress: average('stress'), count: recent.length};
  }, [entries]);

  const narrative = useMemo(() => {
    if (!averages) {
      return {
        title: fa ? 'هنوز در حال ساختن خط پایه شما هستیم' : 'We are still building your baseline',
        body: fa ? 'با یک ثبت کوتاه شروع کنید. بعد از چند ثبت، الگوهای قابل اتکاتری درباره انرژی و فشار روزانه می‌بینید.' : 'Start with one short check-in. After a few entries, you will see more reliable patterns in energy and daily load.',
        confidence: fa ? 'اعتماد فعلاً کم · داده بیشتری لازم است' : 'Low confidence · more check-ins needed',
      };
    }
    if (averages.energy >= 3.8 && averages.stress <= 2.4) {
      return {
        title: fa ? 'ظرفیت امروز شما خوب به نظر می‌رسد' : 'Your capacity looks steady today',
        body: fa ? 'انرژی ثبت‌شده بالاتر و فشار پایین‌تر است. همین روند را با یک اقدام کوچک و قابل تکرار حفظ کنید.' : 'Energy is trending higher while stress is lower. Protect the pattern with one small action you can repeat.',
        confidence: fa ? `اعتماد اولیه · بر اساس ${averages.count} ثبت` : `Early confidence · based on ${averages.count} check-ins`,
      };
    }
    if (averages.stress >= 3.8 || averages.energy <= 2.2) {
      return {
        title: fa ? 'امروز با ظرفیت کمتری پیش بروید' : 'Make room for a lower-capacity day',
        body: fa ? 'این یک تشخیص نیست؛ فقط سیگنالی برای ساده‌کردن برنامه، نور صبحگاهی و فرود آرام‌تر است.' : 'This is not a diagnosis. It is a cue to simplify the day, get morning light, and create a gentler landing.',
        confidence: fa ? `اعتماد اولیه · بر اساس ${averages.count} ثبت` : `Early confidence · based on ${averages.count} check-ins`,
      };
    }
    return {
      title: fa ? 'الگوی شما در حال شکل‌گیری است' : 'Your pattern is taking shape',
      body: fa ? 'انرژی و فشار در محدوده میانی هستند. یک تغییر کوچک را انتخاب کنید تا بفهمیم چه چیزی واقعاً به شما کمک می‌کند.' : 'Energy and load are in the middle range. Choose one small experiment so you can learn what actually helps.',
      confidence: fa ? `اعتماد اولیه · بر اساس ${averages.count} ثبت` : `Early confidence · based on ${averages.count} check-ins`,
    };
  }, [averages, fa]);

  function submitLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry: QuickEntry = {id: `${Date.now()}`, createdAt: new Date().toISOString(), mood, energy, stress, caffeine, note: note.trim().slice(0, 280)};
    const next = [entry, ...entries].slice(0, 90);
    setEntries(next);
    localStorage.setItem(quickLogKey, JSON.stringify(next));
    setLogOpen(false);
    setNote('');
    setCaffeine(false);
    setMessage(fa ? 'ثبت شد؛ بعداً می‌توانید جزئیات را کامل کنید.' : 'Saved. You can refine the details later.');
    window.setTimeout(() => setMessage(''), 3200);
  }

  function startLab(id: LabId) {
    const next: LabState = {id, startedAt: new Date().toISOString(), duration: labOptions[id].duration, checks: []};
    setLab(next);
    localStorage.setItem(labKey, JSON.stringify(next));
    setMessage(fa ? 'آزمایش شخصی شما شروع شد.' : 'Your personal experiment has started.');
    window.setTimeout(() => setMessage(''), 3200);
  }

  function checkLab() {
    if (!lab) return;
    const today = new Date().toISOString().slice(0, 10);
    if (lab.checks.includes(today)) return;
    const next = {...lab, checks: [...lab.checks, today]};
    setLab(next);
    localStorage.setItem(labKey, JSON.stringify(next));
    setMessage(fa ? 'امروز ثبت شد.' : 'Today is checked in.');
    window.setTimeout(() => setMessage(''), 3200);
  }

  const activeLab = lab ? labOptions[lab.id] : null;
  const labProgress = lab && activeLab ? Math.min(100, Math.round((lab.checks.length / activeLab.duration) * 100)) : 0;
  const scale = (value: number, setter: (value: number) => void, labels: [string, string]) => (
    <div className="vela-scale">
      <div><span>{labels[0]}</span><b>{value}/5</b><span>{labels[1]}</span></div>
      <input type="range" min="1" max="5" step="1" value={value} onChange={event => setter(Number(event.target.value))} aria-label={`${labels[0]} ${labels[1]}`} />
    </div>
  );

  return <>
    <section className="vela-shell" aria-label={fa ? 'پوسته اپلیکیشن ولا' : 'VELA app shell'}>
      <header className="vela-appbar">
        <a className="vela-wordmark" href="#today"><strong>VELA</strong><span>{fa ? 'هوش بازیابی' : 'RECOVERY INTELLIGENCE'}</span></a>
        <nav aria-label={fa ? 'ناوبری پرتال' : 'Portal navigation'}>
          <a className="is-active" href="#today">{fa ? 'امروز' : 'Today'}</a>
          <a href="#toolkit">{fa ? 'خواب' : 'Sleep'}</a>
          <a href="#insights">{fa ? 'سلامت' : 'Health'}</a>
          <a href="#learning-library">{fa ? 'یادگیری' : 'Learn'}</a>
          <a href="#privacy">{fa ? 'شما' : 'You'}</a>
        </nav>
        <button className="vela-log-trigger" type="button" onClick={() => setLogOpen(true)}><span>＋</span>{fa ? 'ثبت' : 'Log'}</button>
      </header>

      <div className="vela-narrative" id="today">
        <div className="vela-narrative-mark" aria-hidden="true"><i/><i/><i/></div>
        <div className="vela-narrative-copy"><p className="vela-overline">{fa ? 'روایت امروز' : 'TODAY’S RECOVERY STORY'}</p><h2>{narrative.title}</h2><p>{narrative.body}</p><small>{narrative.confidence}</small></div>
        <div className="vela-narrative-meta"><span>{fa ? 'چرخه روزانه' : 'DAYLIGHT → DREAM'}</span><b>{averages ? `${averages.count}/7` : '0/7'}</b><small>{fa ? 'ثبت این هفته' : 'check-ins this week'}</small></div>
      </div>

      <section className="vela-lab" aria-labelledby="vela-lab-title">
        <div className="vela-lab-heading"><p className="vela-overline">{fa ? 'آزمایشگاه شخصی' : 'PERSONAL LAB'}</p><h2 id="vela-lab-title">{fa ? 'یک تغییر کوچک، یک پاسخ واقعی.' : 'One small change. A real answer.'}</h2><p>{fa ? 'با یک آزمایش هفت‌روزه یاد بگیرید چه چیزی برای بدن و ریتم شما مفید است.' : 'Run a seven-day experiment to learn what actually supports your rhythm.'}</p></div>
        {activeLab ? <div className="vela-lab-active"><div><span className="vela-lab-chip">{fa ? 'در حال اجرا' : 'IN PROGRESS'}</span><h3>{fa ? activeLab.fa : activeLab.en}</h3><p>{fa ? activeLab.copyFa : activeLab.copyEn}</p></div><div className="vela-lab-progress"><strong>{lab?.checks.length}/{activeLab.duration}</strong><div><i style={{width: `${labProgress}%`}}/></div><small>{fa ? 'روز ثبت‌شده' : 'days checked in'}</small><button type="button" className="primary-button" onClick={checkLab}>{fa ? 'ثبت امروز' : 'Check in today'}</button></div></div> : <div className="vela-lab-options">{(Object.keys(labOptions) as LabId[]).map(id => <button type="button" key={id} onClick={() => startLab(id)}><span>{id === 'light' ? '☼' : id === 'caffeine' ? '◒' : '◌'}</span><b>{fa ? labOptions[id].fa : labOptions[id].en}</b><small>{fa ? labOptions[id].copyFa : labOptions[id].copyEn}</small><em>{fa ? 'شروع آزمایش ←' : 'Start experiment →'}</em></button>)}</div>}
      </section>
    </section>

    {logOpen && <div className="vela-sheet-backdrop" role="presentation" onMouseDown={event => {if (event.target === event.currentTarget) setLogOpen(false);}}><section className="vela-log-sheet" role="dialog" aria-modal="true" aria-labelledby="vela-log-title"><div className="vela-sheet-header"><div><p className="vela-overline">{fa ? 'ثبت سریع' : 'QUICK LOG'}</p><h2 id="vela-log-title">{fa ? 'الان چه خبر است؟' : 'What is true right now?'}</h2></div><button type="button" className="vela-close" onClick={() => setLogOpen(false)} aria-label={fa ? 'بستن' : 'Close'}>×</button></div><p className="vela-sheet-intro">{fa ? 'کمتر از یک دقیقه زمان می‌برد. بعداً می‌توانید جزئیات را کامل کنید.' : 'Takes less than a minute. You can refine the details later.'}</p><form onSubmit={submitLog}>{scale(mood, setMood, fa ? ['حال', 'آرام‌تر'] : ['Mood', 'lighter'])}{scale(energy, setEnergy, fa ? ['انرژی کمتر', 'انرژی بیشتر'] : ['Low energy', 'High energy'])}{scale(stress, setStress, fa ? ['فشار کمتر', 'فشار بیشتر'] : ['Low load', 'High load'])}<label className="vela-check"><input type="checkbox" checked={caffeine} onChange={event => setCaffeine(event.target.checked)}/><span>{fa ? 'امروز کافئین مصرف کردم' : 'I had caffeine today'}</span></label><label className="vela-note"><span>{fa ? 'یادداشت اختیاری' : 'Optional note'}</span><textarea value={note} onChange={event => setNote(event.target.value)} maxLength={280} placeholder={fa ? 'یک کلمه یا جمله کوتاه…' : 'A word or short sentence…'}/></label><div className="vela-sheet-actions"><button type="button" className="outline-button" onClick={() => setLogOpen(false)}>{fa ? 'بعداً' : 'Later'}</button><button type="submit" className="primary-button">{fa ? 'ذخیره ثبت' : 'Save check-in'}</button></div></form></section></div>}
    {message && <p className="vela-toast" role="status">{message}</p>}
  </>;
}

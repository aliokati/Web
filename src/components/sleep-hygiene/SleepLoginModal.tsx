'use client';

import {FormEvent, useEffect, useRef, useState} from 'react';
import {ArrowRight, Mail, ShieldCheck, X} from 'lucide-react';
import type {Locale} from '@/i18n/config';
import styles from './SleepHygieneExperience.module.css';

type Props={locale:Locale;open:boolean;onClose:()=>void};
type Stage='username'|'sending'|'code'|'verifying';

export default function SleepLoginModal({locale,open,onClose}:Props){
  const fa=locale==='fa';
  const [stage,setStage]=useState<Stage>('username');
  const [username,setUsername]=useState('');
  const [code,setCode]=useState('');
  const [message,setMessage]=useState('');
  const [error,setError]=useState(false);
  const [expiresAt,setExpiresAt]=useState<number|null>(null);
  const modalRef=useRef<HTMLDivElement>(null);
  const usernameRef=useRef<HTMLInputElement>(null);
  const codeRef=useRef<HTMLInputElement>(null);
  const email=username.trim().toLowerCase()+'@krism-society.com';
  const secondsLeft=expiresAt?Math.max(0,Math.ceil((expiresAt-Date.now())/1000)):0;
  const [,tick]=useState(0);

  useEffect(()=>{if(!expiresAt)return;const timer=window.setInterval(()=>tick(value=>value+1),1000);return()=>window.clearInterval(timer)},[expiresAt]);
  useEffect(()=>{
    if(!open)return;
    const prior=document.activeElement as HTMLElement|null;
    document.body.style.overflow='hidden';
    window.setTimeout(()=>{(stage==='code'?codeRef.current:usernameRef.current)?.focus()},20);
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){onClose();return}
      if(event.key!=='Tab'||!modalRef.current)return;
      const focusable=Array.from(modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),[href]')).filter(node=>node.offsetParent!==null);
      if(!focusable.length)return;
      const first=focusable[0];const last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKeyDown);prior?.focus()};
  },[open,onClose,stage]);
  useEffect(()=>{if(!open){setStage('username');setCode('');setMessage('');setError(false);setExpiresAt(null)}},[open]);

  const show=(text:string,isError=false)=>{setMessage(text);setError(isError)};
  async function requestCode(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const clean=username.trim().toLowerCase();
    if(!clean||clean.includes('@')||/[\s<>;,]/.test(clean)){show(fa?'فقط نام کاربری ایمیل را وارد کنید':'Enter only the username before @krism-society.com',true);return}
    setStage('sending');show('');
    try{
      const response=await fetch('/api/user/auth/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:clean+'@krism-society.com',locale})});
      const body=await response.json().catch(()=>({}));
      if(response.ok){setStage('code');setCode('');setExpiresAt(Date.now()+10*60*1000);show(fa?'کد شش‌رقمی به ایمیل شما ارسال شد':'A six-digit code was sent to your society email');return}
      setStage('username');show(body.error==='rate_limited'?(fa?'چند دقیقه دیگر دوباره تلاش کنید':'Please try again in a few minutes'):body.error==='member_email_required'?(fa?'این ورود برای اعضای KRISM است':'This sign-in is reserved for KRISM members'):(fa?'ارسال کد ممکن نشد':'The code could not be sent'),true);
    }catch{setStage('username');show(fa?'ارتباط برقرار نشد':'Connection failed',true)}
  }
  async function verifyCode(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const clean=code.replace(/\D/g,'');
    if(clean.length!==6){show(fa?'کد شش‌رقمی را وارد کنید':'Enter the six-digit code',true);return}
    setStage('verifying');show('');
    try{
      const response=await fetch('/api/user/auth/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code:clean})});
      const body=await response.json().catch(()=>({}));
      if(response.ok){window.location.reload();return}
      setStage('code');show(body.error==='code_expired'?(fa?'این کد منقضی شده است':'This code has expired'):body.error==='too_many_attempts'?(fa?'تلاش‌های مجاز تمام شد':'Too many attempts, request a new code'):(fa?'کد درست نیست':'That code is not correct'),true);
    }catch{setStage('code');show(fa?'ارتباط برقرار نشد':'Connection failed',true)}
  }
  if(!open)return null;
  const inCode=stage==='code'||stage==='verifying';
  return <div className={styles.modalBackdrop} onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
    <section ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="sleep-login-title" dir={fa?'rtl':'ltr'}>
      <div className={styles.modalTop}><div><p className={styles.eyebrow}><ShieldCheck size={15}/>{fa?'دسترسی اعضا':'MEMBER ACCESS'}</p><h2 id="sleep-login-title">{fa?'ورود به فضای شخصی':'Continue your sleep practice'}</h2></div><button className={styles.close} type="button" aria-label={fa?'بستن':'Close'} onClick={onClose}><X size={17}/></button></div>
      {inCode? <>
        <p className={styles.modalCopy}>{fa?'کدی را که به ایمیل سازمانی شما ارسال شده وارد کنید':'Enter the code sent to your KRISM society email'}</p>
        <form onSubmit={verifyCode}><label className={styles.field} htmlFor="sleep-login-code">{fa?'کد تأیید':'Verification code'}<input ref={codeRef} id="sleep-login-code" className={styles.codeInput} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={event=>setCode(event.target.value.replace(/\D/g,''))} placeholder="000000"/></label><button className={styles.primary} disabled={stage==='verifying'}>{stage==='verifying'?(fa?'در حال بررسی':'Verifying'):(fa?'تأیید و ادامه':'Verify and continue')}<ArrowRight size={15}/></button></form>
        <div className={styles.modalFoot}><span>{secondsLeft>0?(fa?`اعتبار کد: ${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,'0')}`:`Code valid for ${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,'0')}`):(fa?'کد منقضی شده است':'Code has expired')}</span><button type="button" onClick={()=>{setStage('username');setCode('');show('')}}>{fa?'استفاده از ایمیل دیگر':'Use a different email'}</button></div>
      </>: <>
        <p className={styles.modalCopy}>{fa?'نام کاربری ایمیل KRISM خود را وارد کنید تا یک کد یک‌بارمصرف دریافت کنید':'Enter your KRISM email username and we will send a one-time code'}</p>
        <form onSubmit={requestCode}><label className={styles.field} htmlFor="sleep-login-username">{fa?'نام کاربری سازمانی':'Society username'}<span className={styles.emailField}><input ref={usernameRef} id="sleep-login-username" autoComplete="username" value={username} onChange={event=>setUsername(event.target.value.replace(/\s/g,''))} placeholder="your.name"/><span>@krism-society.com</span></span></label><button className={styles.primary} disabled={stage==='sending'}>{stage==='sending'?(fa?'در حال ارسال':'Sending'):(fa?'ارسال کد ورود':'Send sign-in code')}<Mail size={15}/></button></form>
        <div className={styles.modalFoot}><span>{fa?'فقط اعضای تأییدشده KRISM':'For verified KRISM members only'}</span><span>{fa?'کد تا ۱۰ دقیقه معتبر است':'Codes are valid for 10 minutes'}</span></div>
      </>}
      {message&&<p className={`${styles.message}${error?` ${styles.error}`:''}`} role="status">{message}</p>}
    </section>
  </div>;
}

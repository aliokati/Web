'use client';

import {useEffect, useRef, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight, BookOpen, Check, CheckCircle2, Copy, Download, Eye, FileText, Globe2, History, LockKeyhole, LogOut, Plus, RefreshCw, Search, ShieldCheck, Trash2, Users, X} from 'lucide-react';
import {collectionNames, sectionLabels, normalizeSearch, graphicOptions, type CollectionName, type ContentSnapshot, type RecordData} from '@/lib/content-model';

type Values = Record<string, string>;
type Editing = {originalSlug: string | null; slug: string; en: Values; fa: Values; translate: boolean; graphic: string; photo: string; base: RecordData};
type Session = {authenticated: boolean; configured: boolean; setupAllowed: boolean};
type Field = {key: keyof RecordData; en: string; fa: string; kind?: 'area' | 'paragraphs' | 'list' | 'url' | 'date'; help?: [string, string]};
const coreFields: Field[] = [
  {key:'title',en:'Title',fa:'عنوان'}, {key:'category',en:'Topic / category',fa:'موضوع / دسته‌بندی'},
  {key:'description',en:'Summary',fa:'خلاصه',kind:'area'}, {key:'content',en:'Article text',fa:'متن مطلب',kind:'paragraphs',help:['Separate paragraphs with a blank line. Plain text keeps your page formatting consistent.','بندها را با یک خط خالی جدا کنید. قالب صفحه به‌صورت خودکار حفظ می‌شود.']},
  {key:'takeaways',en:'Key ideas',fa:'ایده‌های کلیدی',kind:'list'}, {key:'practicalSteps',en:'Practical steps',fa:'گام‌های عملی',kind:'list'},
  {key:'warningSigns',en:'When to seek help',fa:'چه زمانی کمک بگیریم',kind:'list'},
];
const profileFields: Field[] = [
  {key:'name',en:'Full name',fa:'نام و نام خانوادگی'}, {key:'role',en:'Role',fa:'سمت'},
  {key:'specialty',en:'Specialty',fa:'تخصص'}, {key:'institution',en:'Institution',fa:'مؤسسه'},
  {key:'biography',en:'Biography',fa:'زندگی‌نامه',kind:'area'}, {key:'education',en:'Education',fa:'تحصیلات',kind:'list'},
  {key:'appointments',en:'Appointments',fa:'سمت‌های حرفه‌ای',kind:'list'}, {key:'researchInterests',en:'Research interests',fa:'علایق پژوهشی',kind:'list'},
  {key:'selectedPublications',en:'Selected publications',fa:'انتشارات منتخب',kind:'list'},
];
const sourceFields: Field[] = [
  {key:'source',en:'Source attribution',fa:'توضیح منبع',kind:'area'}, {key:'url',en:'Original source URL',fa:'پیوند منبع اصلی',kind:'url'},
  {key:'downloadUrl',en:'Download URL',fa:'پیوند دریافت فایل',kind:'url'}, {key:'readTime',en:'Reading time',fa:'زمان مطالعه'},
  {key:'reviewedAt',en:'Last reviewed',fa:'تاریخ بازبینی',kind:'date'}, {key:'relatedSlugs',en:'Related page addresses',fa:'نشانی مطالب مرتبط',kind:'list',help:['One page slug per line, from this collection.','نام کوتاه هر صفحه از همین مجموعه را در یک خط بنویسید.']},
];
const profileLinks: Field[] = [
  {key:'googleScholar',en:'Google Scholar URL',fa:'پیوند گوگل اسکالر',kind:'url'}, {key:'orcid',en:'ORCID URL',fa:'پیوند ORCID',kind:'url'},
  {key:'pubmed',en:'PubMed URL',fa:'پیوند PubMed',kind:'url'}, {key:'reviewedAt',en:'Last reviewed',fa:'تاریخ بازبینی',kind:'date'},
];
const allFields = [...coreFields, ...profileFields, ...sourceFields, ...profileLinks];
function toValues(record: Partial<RecordData>): Values {
  return Object.fromEntries(allFields.map(field => {let value = record[field.key]; if (field.key === 'description') value = record.description || record.excerpt || ''; return [field.key, Array.isArray(value) ? value.join(field.kind === 'paragraphs' ? '\n\n' : '\n') : typeof value === 'string' ? value : ''];}));
}
function editRecord(record: RecordData, originalSlug: string | null = record.slug): Editing {
  return {originalSlug, slug: record.slug, en: toValues(record), fa: toValues(record.translations?.fa || {}), translate: record.translationStatus === 'published', graphic: record.graphic || '', photo: record.photo?.replace(/^\/public\//, '/') || '', base: record};
}
function buildRecord(edit: Editing): RecordData {
  const translateValues = (values: Values, translated = false): Partial<RecordData> => {
    const record: Record<string, unknown> = {};
    for (const field of allFields) {
      const value = (values[field.key] || '').trim();
      if (translated && !value) continue;
      if (field.kind === 'paragraphs' || field.kind === 'list') record[field.key] = value ? value.split(field.kind === 'paragraphs' ? /\n\s*\n/ : /\n/).map(x => x.trim()).filter(Boolean) : [];
      else record[field.key] = value;
    }
    if (!translated || values.description) record.excerpt = values.description || '';
    return record;
  };
  return {...edit.base, ...translateValues(edit.en), slug:edit.slug, graphic:edit.graphic, photo:edit.photo, translationStatus: edit.translate ? 'published' : 'draft', translations:{fa:translateValues(edit.fa, true)}};
}
const errors: Record<string, [string, string]> = {
  wrong_password:['That password is incorrect. Please try again.','رمز عبور درست نیست. دوباره تلاش کنید.'],
  unauthorized:['Your session expired. Sign in again; your open edit is still here.','نشست شما پایان یافته است. دوباره وارد شوید؛ ویرایش باز شما حفظ شده است.'],
  password_length:['Use a password between 12 and 200 characters.','رمز عبور باید بین ۱۲ تا ۲۰۰ نویسه باشد.'],
  password_mismatch:['The passwords do not match.','رمزهای عبور یکسان نیستند.'],
  invalid_image:['Choose a JPG, PNG or WebP image under 5 MB and 25 megapixels.','تصویر JPG، PNG یا WebP کوچک‌تر از ۵ مگابایت و ۲۵ مگاپیکسل انتخاب کنید.'],
  conflict:['A newer change was saved in another window. Your edit is preserved. Reload the latest content before trying again.','در پنجره دیگری تغییر تازه‌ای ذخیره شده است. ویرایش شما حفظ شده؛ پیش از تلاش دوباره، آخرین محتوا را بارگیری کنید.'],
  duplicate_slug:['That page address already exists. Choose another one.','این نشانی صفحه قبلاً استفاده شده است. نشانی دیگری انتخاب کنید.'],
  invalid_slug:['Use lowercase English letters, numbers and single hyphens for the page address.','برای نشانی از حروف کوچک انگلیسی، عدد و خط تیره استفاده کنید.'],
  invalid_link:['Links must start with https:// or http://.','پیوندها باید با https:// یا http:// آغاز شوند.'],
  title_required:['Add an English title or name before publishing.','پیش از انتشار، عنوان یا نام انگلیسی را وارد کنید.'],
  translation_title_required:['Add a Persian title or name, or turn off the Persian translation.','عنوان یا نام فارسی را وارد کنید یا ترجمه فارسی را غیرفعال کنید.'],
  storage_unavailable:['Content could not be saved or loaded. Your edit is preserved. Please try again.','ذخیره یا دریافت محتوا انجام نشد. ویرایش شما حفظ شده است. دوباره تلاش کنید.'],
  busy:['Another save is in progress. Please try again in a moment.','ذخیره دیگری در جریان است. چند لحظه دیگر تلاش کنید.'],
  rate_limited:['Too many sign-in attempts. Please wait 15 minutes.','تلاش‌های ورود بیش از حد است. ۱۵ دقیقه صبر کنید.'],
  too_large:['This entry is too large. Shorten the text before publishing.','این مطلب بیش از حد طولانی است. متن را کوتاه‌تر کنید.'],
  setup_local_only:['Create your owner password from the local project first.','ابتدا رمز مالک را در نسخه محلی پروژه ایجاد کنید.'],
  already_configured:['The owner account is already set up. Please sign in.','حساب مالک ساخته شده است. لطفاً وارد شوید.'],
  forbidden:['This request was blocked. Reload this page and try again.','این درخواست مسدود شد. صفحه را تازه‌سازی و دوباره تلاش کنید.'],
};
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {...options, cache:'no-store', headers:{'Content-Type':'application/json', ...options?.headers}});
  const value = await response.json().catch(() => ({error:'storage_unavailable'}));
  if (!response.ok) throw new Error(value.error || 'storage_unavailable');
  return value as T;
}

export default function ContentManager({locale}: {locale:string}) {
  const fa = locale === 'fa'; const t = (en:string, persian:string) => fa ? persian : en;
  const [session,setSession] = useState<Session | null>(null);
  const [snapshot,setSnapshot] = useState<ContentSnapshot | null>(null);
  const [collection,setCollection] = useState<CollectionName>('resources');
  const [query,setQuery] = useState('');
  const [filter,setFilter] = useState('all');
  const [edit,setEdit] = useState<Editing | null>(null);
  const [baseline,setBaseline] = useState('');
  const [language,setLanguage] = useState<'en'|'fa'>('en');
  const [view,setView] = useState<'edit'|'preview'>('edit');
  const [history,setHistory] = useState(false);
  const [security,setSecurity] = useState(false);
  const [images,setImages] = useState<string[]>([]);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState(''); const [notice,setNotice] = useState('');
  const [confirmation,setConfirmation] = useState<{title:string; message:string; action:()=>void} | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const securityDialog = useRef<HTMLDialogElement>(null);
  const saving = useRef(false);
  const dirty = Boolean(edit && JSON.stringify(edit) !== baseline);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const profile = collection === 'board' || collection === 'network';
  function showError(reason:unknown) {
    const code = reason instanceof Error ? reason.message : 'storage_unavailable';
    setError((errors[code] || [t('Please check the entry and try again.','لطفاً محتوا را بررسی و دوباره تلاش کنید.'),'لطفاً محتوا را بررسی و دوباره تلاش کنید.'])[fa ? 1 : 0]);
    if (code === 'unauthorized') setSession(previous => previous ? {...previous,authenticated:false} : null);
  }
  async function load() {
    setError('');
    try {
      const current = await request<Session>('/api/admin/session'); setSession(current);
      if (current.authenticated) {setSnapshot(await request<ContentSnapshot>('/api/admin/content')); const assets = await request<{images:string[]}>('/api/admin/assets'); setImages(assets.images);}
    } catch (reason) {showError(reason);}
  }
  useEffect(() => {void load();}, []);
  useEffect(() => {
    const warn = (event:BeforeUnloadEvent) => {if (dirtyRef.current) {event.preventDefault(); event.returnValue='';}};
    const followLink = (event:MouseEvent) => {
      if(!dirtyRef.current||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const anchor=(event.target as Element).closest('a[href]') as HTMLAnchorElement|null;
      if(!anchor||anchor.target==='_blank'||anchor.hasAttribute('download')||anchor.getAttribute('href')?.startsWith('#'))return;
      event.preventDefault();event.stopPropagation();
      setConfirmation({title:t('Leave this edit?','از این ویرایش خارج شوید؟'),message:t('You have unpublished changes. Leaving will discard them.','تغییرات منتشرنشده دارید. با خروج، این تغییرات کنار گذاشته می‌شوند.'),action:()=>{dirtyRef.current=false;window.location.assign(anchor.href);}});
    };
    window.addEventListener('beforeunload',warn);document.addEventListener('click',followLink,true);
    return()=>{window.removeEventListener('beforeunload',warn);document.removeEventListener('click',followLink,true);};
  }, [locale]);
  useEffect(() => {if (confirmation) dialog.current?.showModal(); else dialog.current?.close();}, [confirmation]);
  useEffect(() => {if(security)securityDialog.current?.showModal();else securityDialog.current?.close();},[security]);
  function guard(action:()=>void) {if (dirty) setConfirmation({title:t('Leave this edit?','از این ویرایش خارج شوید؟'),message:t('You have unpublished changes. Leaving will discard them.','تغییرات منتشرنشده دارید. با خروج، این تغییرات کنار گذاشته می‌شوند.'),action}); else action();}
  function open(record:RecordData, originalSlug:string|null=record.slug) {const next=editRecord(record,originalSlug); setEdit(next); setBaseline(originalSlug ? JSON.stringify(next) : ''); setLanguage(fa?'fa':'en'); setView('edit'); setHistory(false); setError(''); setNotice('');}
  function switchCollection(value:CollectionName) {guard(()=>{setCollection(value); setEdit(null); setQuery(''); setFilter('all'); setHistory(false); setError(''); setNotice('');});}
  async function signIn(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (saving.current) return;
    const form = new FormData(event.currentTarget); const password = form.get('password');
    if (!session?.configured && password !== form.get('confirm')) {showError(new Error('password_mismatch'));return;}
    saving.current=true; setBusy(true);setError('');
    try {await request('/api/admin/session',{method:'POST',body:JSON.stringify({action:session?.configured?'login':'setup',password})}); await load();} catch(reason){showError(reason);} finally {saving.current=false;setBusy(false);}
  }
  async function mutate(payload:Record<string,unknown>, message:string) {
    if (!snapshot || saving.current) return;
    saving.current=true;setBusy(true);setError('');setNotice('');
    try {
      const next = await request<ContentSnapshot>('/api/admin/content',{method:'POST',body:JSON.stringify({...payload,collection,revision:snapshot.revision})});
      setSnapshot(next);setNotice(message);
      if (payload.action === 'publish' && edit) {const saved=next.collections[collection].find(item=>item.slug===edit.slug)!;const nextEdit=editRecord(saved);setEdit(nextEdit);setBaseline(JSON.stringify(nextEdit));}
      else {setEdit(null);setBaseline('');}
    } catch(reason){showError(reason);} finally {saving.current=false;setBusy(false);}
  }
  async function uploadImage(file:File|undefined) {
    if(!file||saving.current)return;
    if(file.size>5*1024*1024){showError(new Error('invalid_image'));return;}
    saving.current=true;setBusy(true);setError('');
    try {const form=new FormData();form.append('image',file);const response=await fetch('/api/admin/assets',{method:'POST',body:form});const result=await response.json();if(!response.ok)throw new Error(result.error);setImages(previous=>[...previous,result.url]);setEdit(previous=>previous?{...previous,photo:result.url}:null);setNotice(t('Image uploaded. Save & publish to use it on this page.','تصویر دریافت شد. برای نمایش در صفحه، ذخیره و انتشار را بزنید.'));}catch(reason){showError(reason);}finally{saving.current=false;setBusy(false);}
  }
  async function updatePassword(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(saving.current)return;const formElement=event.currentTarget;const form=new FormData(formElement);
    if(form.get('password')!==form.get('confirm')){showError(new Error('password_mismatch'));return;}
    saving.current=true;setBusy(true);setError('');
    try {await request('/api/admin/session',{method:'PUT',body:JSON.stringify({currentPassword:form.get('currentPassword'),password:form.get('password')})});formElement.reset();setSecurity(false);setNotice(t('Password changed. Other signed-in sessions have been ended.','رمز تغییر کرد. نشست‌های ورود دیگر پایان یافتند.'));}catch(reason){showError(reason);}finally{saving.current=false;setBusy(false);}
  }
  function newRecord() {guard(()=>open({slug:'', [profile?'name':'title']:'',status:'published',translationStatus:'draft'},null));}
  function duplicate() {if (!edit || !snapshot) return;guard(()=>{const record=buildRecord(edit);let slug=record.slug+'-copy';let n=2;while(snapshot.collections[collection].some(item=>item.slug===slug))slug=record.slug+'-copy-'+n++;record.slug=slug;if(profile)record.name=(record.name||'')+' (copy)';else record.title=(record.title||'')+' (copy)';delete record.publishedAt;delete record.updatedAt;open(record,null);});}
  function setValue(key:string,value:string) {setEdit(previous=>previous?{...previous,[language]:{...previous[language],[key]:value}}:null);}
  function exportBackup() {if(!snapshot)return;const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=`krism-content-${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(url);setNotice(t('Content backup downloaded. It contains no passwords.','نسخه پشتیبان محتوا دریافت شد. این فایل شامل رمز عبور نیست.'));}
  const list=snapshot?.collections[collection] || [];
  const filtered=list.filter(record=>(filter==='all'||(filter==='translated'?record.translationStatus==='published':record.translationStatus!=='published'))&&normalizeSearch([record.title,record.name,record.slug,record.category,record.translations?.fa?.title,record.translations?.fa?.name].join(' ')).includes(normalizeSearch(query)));
  const fields=profile?profileFields:coreFields;
  const links=profile?profileLinks:sourceFields;
  const preview=edit?{...buildRecord(edit),...(language==='fa'?buildRecord(edit).translations?.fa:{})}:null;
  function renderFields(specs:Field[]) {return specs.map(field=><label className={field.kind==='area'||field.kind==='paragraphs'||field.kind==='list'?'cms-field cms-field-wide':'cms-field'} key={field.key}><span>{fa?field.fa:field.en}{((profile?field.key==='name':field.key==='title')&&(language==='en'||edit?.translate))&&' *'}</span>{field.kind==='area'||field.kind==='paragraphs'||field.kind==='list'?<textarea value={edit?.[language][field.key]||''} rows={field.kind==='paragraphs'?12:field.kind==='area'?4:3} onChange={event=>setValue(field.key,event.target.value)} dir={language==='fa'?'rtl':'ltr'} maxLength={field.kind==='paragraphs'?200000:20000}/>:<input value={edit?.[language][field.key]||''} type={field.kind==='url'?'url':field.kind==='date'?'date':'text'} onChange={event=>setValue(field.key,event.target.value)} dir={field.kind==='url'||field.kind==='date'?'ltr':language==='fa'?'rtl':'ltr'} required={(profile?field.key==='name':field.key==='title')&&(language==='en'||Boolean(edit?.translate))} maxLength={4000}/>}<small>{field.help?.[fa?1:0] || (field.kind==='list'?t('One item per line.','هر مورد در یک خط.'):null)}</small></label>);}

  return <main className="legacy-page cms-shell">
    <header className="cms-heading"><div><Link href={`/${locale}`} className="cms-back"><ArrowLeft size={14}/>{t('Back to website','بازگشت به وب‌سایت')}</Link><p className="cms-eyebrow">KRISM / {t('EDITORIAL DESK','میز تحریریه')}</p><h1>{t('Content manager','مدیریت محتوا')}</h1><p>{t('Your knowledge. Your voice. Ready to publish.','دانش شما، با صدای شما؛ آماده انتشار.')}</p></div><span className="cms-private"><ShieldCheck size={17}/>{t('Private owner access','دسترسی خصوصی مالک')}</span></header>
    {!session?.authenticated ? <section className="cms-access"><div className="cms-access-story"><div className="cms-access-icon"><BookOpen size={36}/></div><h2>{t('A home for the knowledge you share.','خانه‌ای برای دانشی که به اشتراک می‌گذارید.')}</h2><p>{t('Manage learning resources, professional profiles, research and events in one bilingual workspace.','منابع آموزشی، پروفایل‌های حرفه‌ای، پژوهش و رویدادها را در یک محیط دوزبانه مدیریت کنید.')}</p><ul><li><Check size={17}/>{t('Publish directly to your website','انتشار مستقیم در وب‌سایت')}</li><li><Check size={17}/>{t('Keep English and Persian together','مدیریت یکپارچه فارسی و انگلیسی')}</li><li><Check size={17}/>{t('Recover previous versions','بازیابی نسخه‌های پیشین')}</li></ul></div><div className="cms-access-form"><LockKeyhole size={27}/><h2>{session?(session.configured?t('Welcome back','خوش آمدید'):t('Make this workspace yours','این محیط را خصوصی کنید')):t('Opening your workspace…','در حال دریافت محیط مدیریت…')}</h2>{session&&(session.configured||session.setupAllowed)?<form onSubmit={signIn}><p>{session.configured?t('Enter your owner password to continue.','برای ادامه رمز مالک را وارد کنید.'):t('Create a private password of at least 12 characters. You will use it whenever you edit the website.','یک رمز خصوصی با دست‌کم ۱۲ نویسه بسازید. برای مدیریت سایت از این رمز استفاده خواهید کرد.')}</p><label className="cms-field"><span>{t('Owner password','رمز مالک')}</span><input name="password" type="password" autoComplete={session.configured?'current-password':'new-password'} minLength={session.configured?1:12} maxLength={200} required disabled={busy} autoFocus/></label>{!session.configured&&<label className="cms-field"><span>{t('Confirm password','تکرار رمز عبور')}</span><input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={200} required disabled={busy}/></label>}<button className="cms-primary" disabled={busy}>{busy?t('Please wait…','لطفاً صبر کنید…'):session.configured?t('Sign in','ورود'):t('Create owner access','ایجاد دسترسی مالک')}<ArrowUpRight size={17}/></button></form>:session&&!session.setupAllowed?<p>{t('Owner access must first be set up from the local project.','دسترسی مالک ابتدا باید در نسخه محلی پروژه ایجاد شود.')}</p>:null}{error&&<p className="cms-alert cms-alert-error" role="alert">{error}<button type="button" onClick={()=>void load()}>{t('Try again','تلاش دوباره')}</button></p>}</div></section>:
    <>
      <div className="cms-topbar"><div className="cms-live"><span/>{t('Publish immediately','انتشار فوری')}<small>{snapshot?`${Object.values(snapshot.collections).reduce((total,records)=>total+records.length,0)} ${t('published entries','مطلب منتشرشده')}`:t('Loading content…','در حال دریافت محتوا…')}</small></div><div className="cms-actions"><button type="button" onClick={()=>guard(()=>{setEdit(null);void load();})} disabled={busy}><RefreshCw size={15}/>{t('Reload','بارگیری مجدد')}</button><button type="button" onClick={exportBackup} disabled={!snapshot||busy}><Download size={15}/>{t('Download backup','دریافت پشتیبان')}</button><button type="button" disabled={busy} onClick={()=>{setError('');setSecurity(true);}}><LockKeyhole size={15}/>{t('Password','رمز عبور')}</button><button type="button" disabled={busy} onClick={()=>guard(async()=>{try{await request('/api/admin/session',{method:'DELETE'});setSession(previous=>previous?{...previous,authenticated:false}:null);setEdit(null);setSnapshot(null);}catch(reason){showError(reason);}})}><LogOut size={15}/>{t('Sign out','خروج')}</button></div></div>
      {error&&<div className="cms-alert cms-alert-error" role="alert">{error}</div>}{notice&&<div className="cms-alert cms-alert-success" role="status"><CheckCircle2 size={17}/>{notice}</div>}
      <div className="cms-workspace"><nav className="cms-nav" aria-label={t('Content collections','مجموعه‌های محتوا')}><p className="cms-eyebrow">{t('YOUR CONTENT','محتوای شما')}</p>{collectionNames.map(name=><button type="button" key={name} aria-current={collection===name?'page':undefined} onClick={()=>switchCollection(name)} disabled={busy}>{name==='board'||name==='network'?<Users size={17}/>:<FileText size={17}/>}<span>{sectionLabels[name][fa?1:0]}</span><b>{snapshot?.collections[name].length??'–'}</b></button>)}<div className="cms-nav-note"><ShieldCheck size={20}/><p>{t('Every publication is saved on the server. Recent changes can be undone from History.','هر انتشار در سرور ذخیره می‌شود. تغییرات اخیر از بخش تاریخچه قابل بازیابی است.')}</p></div></nav>
      <section className="cms-main"><div className="cms-section-heading"><div><p className="cms-eyebrow">{profile?t('PEOPLE & EXPERTISE','افراد و تخصص‌ها'):t('PUBLISHED COLLECTION','مجموعه منتشرشده')}</p><h2>{sectionLabels[collection][fa?1:0]}</h2></div><div className="cms-actions"><button type="button" aria-pressed={history} onClick={()=>guard(()=>{setHistory(!history);setEdit(null);})} disabled={busy}><History size={16}/>{t('History','تاریخچه')}</button><button type="button" className="cms-primary" onClick={newRecord} disabled={busy||!snapshot}><Plus size={16}/>{profile?t('Add profile','افزودن پروفایل'):t('Add entry','افزودن مطلب')}</button></div></div>
      {history?<div className="cms-history"><p className="cms-help">{t('The last 100 changes are kept across all collections. Restore returns an entry to the version before that change and takes effect immediately.','۱۰۰ تغییر اخیر همه مجموعه‌ها نگهداری می‌شود. بازیابی، مطلب را فوراً به نسخه پیش از تغییر برمی‌گرداند.')}</p>{snapshot?.history.filter(item=>item.collection===collection).map(item=><article key={item.id}><div><span className="cms-badge">{item.action==='delete'?t('Removed','حذف‌شده'):item.action==='restore'?t('Restored','بازیابی‌شده'):t('Published','منتشرشده')}</span><h3>{item.title}</h3><time dateTime={item.at}>{new Date(item.at).toLocaleString(fa?'fa-IR':'en-GB')}</time><details><summary>{t('Inspect previous version','مشاهده نسخه پیشین')}</summary>{item.before?<div><strong>{item.before.title||item.before.name}</strong><p>{item.before.description||item.before.excerpt||item.before.biography}</p>{item.before.content?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>:<p>{t('This entry did not exist before this change. Restoring removes it from the website.','پیش از این تغییر، مطلب وجود نداشت. بازیابی آن را از وب‌سایت برمی‌دارد.')}</p>}</details></div><button type="button" disabled={busy} onClick={()=>setConfirmation({title:t('Restore previous version?','نسخه پیشین بازیابی شود؟'),message:t('This will immediately replace the current entry with the version shown here. You can undo this restoration from History.','نسخه نشان‌داده‌شده فوراً جایگزین مطلب فعلی می‌شود. این بازیابی نیز از تاریخچه قابل بازگشت است.'),action:()=>void mutate({action:'restore',historyId:item.id},t('Previous version restored on the website.','نسخه پیشین در وب‌سایت بازیابی شد.'))})}><History size={15}/>{t('Restore','بازیابی')}</button></article>)}{!snapshot?.history.some(item=>item.collection===collection)&&<div className="cms-empty"><History size={32}/><h3>{t('A fresh editorial history','تاریخچه‌ای تازه')}</h3><p>{t('Your first published change will appear here.','نخستین تغییر منتشرشده شما اینجا نمایش داده می‌شود.')}</p></div>}</div>:
      <div className={`cms-editor-layout ${edit?'cms-is-editing':''}`}><div className="cms-inventory"><label className="cms-search"><Search size={17}/><input type="search" aria-label={t('Search content','جستجوی محتوا')} placeholder={t('Search title, name or address…','جستجوی عنوان، نام یا نشانی…')} value={query} onChange={event=>setQuery(event.target.value)}/></label><div className="cms-list-controls"><span>{filtered.length} {t('entries','مطلب')}</span><select aria-label={t('Translation filter','فیلتر ترجمه')} value={filter} onChange={event=>setFilter(event.target.value)}><option value="all">{t('All languages','همه زبان‌ها')}</option><option value="translated">{t('Persian ready','فارسی آماده')}</option><option value="untranslated">{t('Needs Persian','نیازمند فارسی')}</option></select></div><div className="cms-records">{filtered.map(record=><button type="button" className="cms-record" key={record.slug} aria-pressed={edit?.originalSlug===record.slug} disabled={busy} onClick={()=>guard(()=>open(record))}><span className="cms-record-icon">{profile?<Users size={20}/>:<FileText size={20}/>}</span><span><strong>{(fa&&record.translationStatus==='published'?(record.translations?.fa?.title||record.translations?.fa?.name):null)||record.title||record.name}</strong><small dir="ltr">/{collection}/{record.slug}</small><span className="cms-record-meta"><span>{t('Published','منتشرشده')}</span><span><Globe2 size={12}/>{record.translationStatus==='published'?'EN · FA':'EN'}</span></span></span><ArrowUpRight size={17}/></button>)}</div>{!filtered.length&&<div className="cms-empty"><BookOpen size={30}/><h3>{query||filter!=='all'?t('No matching entries','مطلبی پیدا نشد'):t('Start this collection','این مجموعه را آغاز کنید')}</h3><p>{query||filter!=='all'?t('Try another search or clear the filters.','عبارت دیگری بنویسید یا فیلترها را پاک کنید.'):t('Add your first entry when the information is ready.','وقتی اطلاعات آماده شد، نخستین مطلب را اضافه کنید.')}</p>{(query||filter!=='all')&&<button type="button" onClick={()=>{setQuery('');setFilter('all');}}>{t('Clear filters','پاک کردن فیلترها')}</button>}</div>}</div>
      {edit&&<div className="cms-editor" aria-label={t('Content editor','ویرایشگر محتوا')}><div className="cms-editor-heading"><div><span className="cms-badge">{edit.originalSlug?(dirty?t('Unsaved changes','تغییرات ذخیره‌نشده'):t('Published','منتشرشده')):t('New entry','مطلب جدید')}</span><h3>{edit[language][profile?'name':'title']||t('Untitled entry','بدون عنوان')}</h3></div><button type="button" className="cms-icon-button" aria-label={t('Close editor','بستن ویرایشگر')} disabled={busy} onClick={()=>guard(()=>setEdit(null))}><X size={20}/></button></div>
        <div className="cms-editor-tabs"><div className="cms-language" aria-label={t('Editing language','زبان ویرایش')}><button type="button" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>English</button><button type="button" aria-pressed={language==='fa'} onClick={()=>setLanguage('fa')}>فارسی</button></div><button type="button" aria-pressed={view==='preview'} onClick={()=>setView(view==='preview'?'edit':'preview')}><Eye size={16}/>{view==='preview'?t('Edit','ویرایش'):t('Preview','پیش‌نمایش')}</button></div>
        {view==='preview'&&preview?<article className="cms-preview" lang={language} dir={language==='fa'?'rtl':'ltr'}><p className="cms-eyebrow">{t('UNPUBLISHED PREVIEW','پیش‌نمایش تغییرات')}</p>{preview.photo&&<img className="cms-preview-photo" src={preview.photo} alt=""/>}<h2>{preview.title||preview.name||t('Untitled entry','بدون عنوان')}</h2><p className="cms-preview-lead">{preview.description||preview.excerpt||preview.role}</p>{preview.specialty&&<h3>{preview.specialty}</h3>}{preview.institution&&<p>{preview.institution}</p>}{preview.biography&&<p>{preview.biography}</p>}{preview.content?.map((text,index)=><p key={index}>{text}</p>)}{[...fields,...links].filter(field=>field.kind==='list').map(field=>{const values=preview[field.key];return Array.isArray(values)&&values.length>0?<section key={field.key}><h3>{language==='fa'?field.fa:field.en}</h3><ul>{values.map((text,index)=><li key={index}>{text}</li>)}</ul></section>:null;})}</article>:
        <form id="cms-editor-form" onSubmit={event=>{event.preventDefault();void mutate({action:'publish',originalSlug:edit.originalSlug,record:buildRecord(edit)},t('Published. Your website now shows this version.','منتشر شد. این نسخه اکنون در وب‌سایت نمایش داده می‌شود.'));}}><fieldset disabled={busy}><div className="cms-editor-body"><label className="cms-field"><span>{t('Page address','نشانی صفحه')} *</span><div className="cms-slug"><span dir="ltr">/{collection}/</span><input dir="ltr" value={edit.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} readOnly={Boolean(edit.originalSlug)} onChange={event=>setEdit({...edit,slug:event.target.value})}/></div><small>{edit.originalSlug?t('The published address stays fixed so existing links keep working.','نشانی منتشرشده ثابت می‌ماند تا پیوندهای قبلی کار کنند.'):t('Choose a short address using English letters, numbers and hyphens.','یک نام کوتاه با حروف انگلیسی، عدد و خط تیره انتخاب کنید.')}</small></label><label className="cms-check"><input type="checkbox" checked={edit.translate} onChange={event=>setEdit({...edit,translate:event.target.checked})}/><span>{t('Publish the Persian translation','انتشار ترجمه فارسی')}<small>{t('When off, the Persian page displays the English content.','اگر خاموش باشد، صفحه فارسی محتوای انگلیسی را نمایش می‌دهد.')}</small></span></label><div className="cms-fields">{renderFields(fields)}</div><details className="cms-details"><summary>{profile?t('Profile links & review date','پیوندهای پروفایل و تاریخ بازبینی'):t('Sources, review date & related content','منابع، تاریخ بازبینی و مطالب مرتبط')}</summary><div className="cms-fields">{renderFields(links)}</div></details><details className="cms-details"><summary>{t('Image & illustration','تصویر و نمودار')}</summary><p className="cms-help">{t('Shared by both language versions.','در هر دو زبان مشترک است.')}</p><label className="cms-field"><span>{t('Image from the website','تصویر از وب‌سایت')}</span><select value={edit.photo} onChange={event=>setEdit({...edit,photo:event.target.value})}><option value="">{t('No image','بدون تصویر')}</option>{images.map(image=><option key={image} value={image}>{image.split('/').pop()}</option>)}</select></label><label className="cms-field"><span>{t('Upload an image','بارگذاری تصویر')}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>{void uploadImage(event.target.files?.[0]);event.target.value='';}}/><small>{t('JPG, PNG or WebP, up to 5 MB. Images are resized and optimized automatically.','JPG، PNG یا WebP تا ۵ مگابایت. اندازه و حجم تصویر به‌صورت خودکار بهینه می‌شود.')}</small></label>{edit.photo&&<img className="cms-asset-preview" src={edit.photo} alt=""/>}{!profile&&<label className="cms-field"><span>{t('Educational illustration','نمودار آموزشی')}</span><select value={edit.graphic} onChange={event=>setEdit({...edit,graphic:event.target.value})}><option value="">{t('None','هیچ‌کدام')}</option>{graphicOptions.map(option=><option key={option} value={option}>{option.replace(/-/g,' ')}</option>)}</select></label>}</details></div></fieldset></form>}
        <div className="cms-publish-bar"><div><span className={dirty?'cms-unsaved':'cms-saved'}>{dirty?t('Changes are not published yet','تغییرات هنوز منتشر نشده‌اند'):t('Up to date','به‌روز')}</span><small>{t('Publishing updates the website immediately.','انتشار، وب‌سایت را بلافاصله به‌روزرسانی می‌کند.')}</small></div><button type="button" className="cms-primary" disabled={busy||!dirty} onClick={()=>{if(view==='preview'){setView('edit');return;}const form=document.getElementById('cms-editor-form') as HTMLFormElement;form?.requestSubmit();}}>{busy?t('Publishing…','در حال انتشار…'):view==='preview'?t('Return to publish','بازگشت برای انتشار'):t('Save & publish','ذخیره و انتشار')}<ArrowUpRight size={16}/></button></div>
        <div className="cms-editor-footer"><div className="cms-actions">{edit.originalSlug&&<a href={`/${language}/${collection}/${edit.originalSlug}`} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={14}/>{t('View page','مشاهده صفحه')}</a>}<button type="button" disabled={busy} onClick={duplicate}><Copy size={14}/>{t('Duplicate','ساخت نسخه مشابه')}</button></div>{edit.originalSlug&&<button type="button" className="cms-danger" disabled={busy} onClick={()=>setConfirmation({title:t('Remove this entry?','این مطلب حذف شود؟'),message:t('It will disappear from the public website. You can recover it from History.','این مطلب از وب‌سایت عمومی برداشته می‌شود و از تاریخچه قابل بازیابی است.'),action:()=>void mutate({action:'delete',slug:edit.originalSlug},t('Entry removed. You can restore it from History.','مطلب حذف شد. از تاریخچه می‌توانید آن را بازیابی کنید.'))})}><Trash2 size={14}/>{t('Remove','حذف')}</button>}</div>
      </div>}</div>}
      </section></div>
    </>}
    <dialog ref={securityDialog} className="cms-dialog" onCancel={()=>{if(!busy)setSecurity(false);}} aria-labelledby="cms-security-title"><h2 id="cms-security-title">{t('Change owner password','تغییر رمز مالک')}</h2><form onSubmit={updatePassword}><fieldset disabled={busy}><label className="cms-field"><span>{t('Current password','رمز فعلی')}</span><input name="currentPassword" type="password" autoComplete="current-password" required maxLength={200}/></label><label className="cms-field"><span>{t('New password','رمز جدید')}</span><input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={200} required/></label><label className="cms-field"><span>{t('Confirm new password','تکرار رمز جدید')}</span><input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={200} required/></label>{error&&<p className="cms-alert cms-alert-error" role="alert">{error}</p>}<div className="cms-actions"><button type="button" onClick={()=>setSecurity(false)}>{t('Cancel','انصراف')}</button><button className="cms-primary" type="submit">{busy?t('Saving…','در حال ذخیره…'):t('Change password','تغییر رمز')}</button></div></fieldset></form></dialog>
    <dialog ref={dialog} className="cms-dialog" onCancel={()=>setConfirmation(null)} aria-labelledby="cms-dialog-title"><h2 id="cms-dialog-title">{confirmation?.title}</h2><p>{confirmation?.message}</p><div className="cms-actions"><button type="button" autoFocus onClick={()=>setConfirmation(null)}>{t('Cancel','انصراف')}</button><button type="button" className="cms-primary" onClick={()=>{const action=confirmation?.action;setConfirmation(null);action?.();}}>{t('Continue','ادامه')}</button></div></dialog>
  </main>;
}

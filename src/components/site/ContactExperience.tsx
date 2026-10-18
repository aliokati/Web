'use client';
import {useRef, useState} from 'react';
import type {FormEvent} from 'react';
import Link from 'next/link';
import {ArrowRight, ArrowUpRight, Building2, FlaskConical, GraduationCap, Handshake, Mail, MapPin, Phone, Clock3, MessageSquare, Send} from 'lucide-react';
import type {ContactDetails} from '@/content/contact-details';

export default function ContactExperience({locale, details}: {locale: string; details: ContactDetails}) {
  const fa = locale === 'fa';
  const t = (en: string, persian: string) => fa ? persian : en;
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const submitting = useRef(false);
  const topics = [
    {id: 'research', icon: FlaskConical, name: t('Research collaboration', 'همکاری پژوهشی'), description: t('Scientific projects and academic exchange', 'پروژه‌های علمی و تبادل دانشگاهی')},
    {id: 'education', icon: GraduationCap, name: t('Education & events', 'آموزش و رویدادها'), description: t('Workshops, meetings and shared learning', 'کارگاه‌ها، نشست‌ها و آموزش مشترک')},
    {id: 'partnership', icon: Handshake, name: t('Institutional partnerships', 'همکاری سازمانی'), description: t('Professional networks and joint initiatives', 'شبکه‌های حرفه‌ای و برنامه‌های مشترک')},
    {id: 'general', icon: MessageSquare, name: t('General & media enquiries', 'درخواست‌های عمومی و رسانه‌ای'), description: t('Organizational questions and communications', 'پرسش‌های سازمانی و ارتباطات رسانه‌ای')},
  ];
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus('sending');
    setStatusMessage(t('Sending your enquiry…', 'درخواست شما در حال ارسال است…'));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: form.get('name'), email: form.get('email'), organization: form.get('organization'), role: form.get('role'),
          topic: form.get('topic'), subject: form.get('subject'), message: form.get('message'), website: form.get('website'), locale,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true || typeof result.reference !== 'string') throw new Error(typeof result.error === 'string' ? result.error : t('We could not send this enquiry. Please try again later', 'ارسال درخواست انجام نشد. لطفاً بعداً دوباره تلاش کنید'));
      setStatus('sent');
      setStatusMessage(`${t('Enquiry submitted. Reference:', 'درخواست ارسال شد. کد پیگیری:')} ${result.reference}`);
      formElement.reset();
      setTopic('');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : t('We could not send this enquiry. Please try again later', 'ارسال درخواست انجام نشد. لطفاً بعداً دوباره تلاش کنید'));
    } finally {
      submitting.current = false;
    }
  }
  return <main className="legacy-page corporate-contact">
    <section className="contact-hero"><div className="page-wrap contact-hero-grid">
      <div><p className="tech-label">{t('CONTACT KRISM', 'تماس با KRISM')}</p><h1>{t('Progress starts with', 'پیشرفت با')}<br/><em>{t('a conversation', 'گفت‌وگو آغاز می‌شود')}</em></h1><p className="contact-hero-description">{t('Connect with our community of clinicians, researchers and institutions to advance sleep medicine across Khorasan', 'برای پیشبرد پزشکی خواب در خراسان، با جامعه پزشکان، پژوهشگران و نهادهای همکار ارتباط بگیرید')}</p><a className="primary-button" href="#enquiry">{t('Make an enquiry', 'ثبت درخواست ارتباط')}<ArrowRight size={17} className="directional-arrow"/></a></div>
      <div className="contact-identity"><div className="contact-identity-top"><img src="/images/krism-logo.png" alt="" width={72} height={72}/><span className="contact-identity-code">KRISM</span></div><div><p className="tech-label">{t('KHORASAN · IRAN', 'خراسان · ایران')}</p><h2>{t('Sleep science', 'علم خواب')}<br/>{t('Shared purpose', 'هدفی مشترک')}</h2></div><div className="contact-identity-bottom"><span>{t('Research', 'پژوهش')}</span><span>{t('Education', 'آموزش')}</span><span>{t('Collaboration', 'همکاری')}</span></div><div className="contact-identity-art" aria-hidden="true"/></div>
    </div></section>
    <section className="section-space surface-mineral"><div className="page-wrap contact-layout">
      <aside className="contact-sidebar">
        <p className="tech-label">{t('HOW WE CAN CONNECT', 'زمینه‌های ارتباط')}</p><h2>{t('The right conversation', 'گفت‌وگویی هدفمند')}</h2><p className="contact-sidebar-intro">{t('Choose a topic to help us understand your enquiry', 'موضوعی را انتخاب کنید تا هدف درخواست شما روشن‌تر باشد')}</p>
        <div className="contact-topics">{topics.map(({id, name, description, icon: Icon}) => <button type="button" key={id} disabled={status === 'sending'} aria-pressed={topic === id} onClick={() => {setTopic(id); setStatus('idle'); setStatusMessage('');}}><span className="contact-topic-icon"><Icon size={21} strokeWidth={1.5}/></span><span><strong>{name}</strong><small>{description}</small></span><ArrowRight size={16} className="directional-arrow"/></button>)}</div>
        <section className="contact-office" aria-labelledby="office-heading"><div className="contact-office-heading"><Building2 size={21}/><h3 id="office-heading">{t('Contact & office', 'دفتر و راه‌های ارتباطی')}</h3></div>
          <div className="contact-channel"><MapPin size={17}/><div><span>{t('Location', 'نشانی')}</span><address>{details.address[fa ? 'fa' : 'en'] || t('Khorasan Region, Iran', 'منطقه خراسان، ایران')}</address></div></div>
          {details.email && <a className="contact-channel" href={`mailto:${details.email}`}><Mail size={17}/><span><small>{t('Email', 'ایمیل')}</small><bdi>{details.email}</bdi></span></a>}
          {details.phone && <a className="contact-channel" href={`tel:${details.phone.replace(/[^+\d]/g, '')}`}><Phone size={17}/><span><small>{t('Telephone', 'تلفن')}</small><bdi>{details.phone}</bdi></span></a>}
          {details.hours[fa ? 'fa' : 'en'] && <div className="contact-channel"><Clock3 size={17}/><div><span>{t('Office hours', 'ساعات کاری')}</span><p>{details.hours[fa ? 'fa' : 'en']}</p></div></div>}
          {details.socialLinks.length > 0 && <div className="contact-socials">{details.socialLinks.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label}<ArrowUpRight size={14}/></a>)}</div>}
        </section>
      </aside>
      <section className="corporate-form-card" id="enquiry" aria-labelledby="enquiry-heading">
        <div className="corporate-form-heading"><span className="corporate-form-icon"><Mail size={25} strokeWidth={1.5}/></span><div><p className="tech-label">{t('PROFESSIONAL & ORGANIZATIONAL ENQUIRIES', 'درخواست‌های حرفه‌ای و سازمانی')}</p><h2 id="enquiry-heading">{t('Tell us how we can connect', 'از زمینه همکاری بگویید')}</h2></div></div>
        <p className="corporate-form-intro">{t('Share a brief introduction and the purpose of your enquiry. Fields marked * are required', 'معرفی کوتاهی از خود و هدف درخواستتان بنویسید. تکمیل موارد ستاره‌دار الزامی است')}</p>
        <form className="corporate-form" onSubmit={submitEnquiry} onChange={() => {if (status !== 'sending') {setStatus('idle'); setStatusMessage('');}}}>
          <fieldset className="corporate-form-fields" disabled={status === 'sending'}>
          <div className="form-pair"><label>{t('Full name', 'نام و نام خانوادگی')} <span aria-hidden="true">*</span><input name="name" autoComplete="name" required minLength={2} maxLength={120}/></label><label>{t('Email address', 'نشانی ایمیل')} <span aria-hidden="true">*</span><input name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254}/></label></div>
          <div className="form-pair"><label>{t('Organization / institution', 'سازمان / مؤسسه')}<input name="organization" autoComplete="organization" maxLength={160}/></label><label>{t('Role / specialty', 'سمت / تخصص')}<input name="role" autoComplete="organization-title" maxLength={120}/></label></div>
          <label>{t('Enquiry type', 'نوع درخواست')} <span aria-hidden="true">*</span><select name="topic" required value={topic} onChange={event => setTopic(event.target.value)}><option value="" disabled>{t('Select a topic', 'موضوع را انتخاب کنید')}</option>{topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>{t('Subject', 'عنوان درخواست')} <span aria-hidden="true">*</span><input name="subject" required minLength={3} maxLength={180}/></label>
          <label>{t('Your message', 'پیام شما')} <span aria-hidden="true">*</span><textarea name="message" rows={6} required minLength={20} maxLength={5000} placeholder={t('A short introduction, the proposed collaboration, and what you would like to discuss…', 'معرفی کوتاه، زمینه پیشنهادی همکاری و موضوعی که مایل به گفت‌وگو درباره آن هستید…')}/></label>
          <label className="contact-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
          <div className="corporate-form-actions"><button className="primary-button" type="submit" disabled={status === 'sending'}><Send size={17}/>{status === 'sending' ? t('Sending…', 'در حال ارسال…') : t('Submit enquiry', 'ارسال درخواست')}</button><p>{t('Your contact details and message will be emailed to the KRISM team', 'اطلاعات تماس و پیام شما برای تیم KRISM ایمیل می‌شود')} <Link href={`/${locale}/standards`}>{t('Privacy information', 'اطلاعات حریم خصوصی')}</Link></p></div>
          </fieldset>
          <p role="status" className={`contact-form-status contact-form-status--${status}`}>{statusMessage}</p>
        </form>
        <div className="corporate-form-footnote"><span>{t('For general sleep-health information, visit our educational library', 'برای اطلاعات عمومی سلامت خواب، به کتابخانه آموزشی مراجعه کنید')}</span><Link href={`/${locale}/public`}>{t('Sleep health', 'سلامت خواب')}<ArrowUpRight size={14}/></Link></div>
      </section>
    </div></section>
    <section className="contact-bottom-strip"><div className="page-wrap"><span>{t('Get to know the society behind the conversation', 'با جامعه علمی پشت این گفت‌وگو آشنا شوید')}</span><Link href={`/${locale}/about`}>{t('About KRISM', 'درباره KRISM')}<ArrowRight size={16} className="directional-arrow"/></Link><Link href={`/${locale}/research-board`}>{t('Research board', 'شورای پژوهشی')}<ArrowRight size={16} className="directional-arrow"/></Link></div></section>
  </main>;
}

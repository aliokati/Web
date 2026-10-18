'use client';
import {useState} from 'react';
import type {FormEvent} from 'react';

export default function ContactDraft({locale}: {locale: string}) {
  const fa = locale === 'fa';
  const [saved, setSaved] = useState(false);
  const t = (en: string, persian: string) => fa ? persian : en;
  function downloadDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = [t('KRISM — inquiry draft', 'KRISM — پیش‌نویس درخواست'), '', `${t('Name', 'نام')}: ${data.get('name')}`, `${t('Email', 'ایمیل')}: ${data.get('email')}`, `${t('Inquiry type', 'نوع درخواست')}: ${data.get('type')}`, `${t('Subject', 'موضوع')}: ${data.get('subject')}`, '', data.get('message'), '', t('Saved locally. This message has not been sent', 'ذخیره‌شده در دستگاه شما؛ این پیام ارسال نشده است')].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], {type: 'text/plain;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'krism-inquiry-draft.txt';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return <>
    <p className="draft-note">{t('Prepare and download an inquiry for later use. An official contact address has not yet been configured, so this form saves a text file on your device and does not send a message', 'درخواست خود را آماده کنید و برای استفاده بعدی دریافت کنید. نشانی تماس رسمی هنوز تنظیم نشده است؛ این فرم فقط یک فایل متنی در دستگاه شما ذخیره می‌کند و پیامی ارسال نمی‌کند')}</p>
    <form className="contact-draft" onSubmit={downloadDraft} onChange={() => setSaved(false)}>
      <div className="form-pair"><label>{t('Your name', 'نام شما')}<input name="name" autoComplete="name" required maxLength={120}/></label><label>{t('Email', 'ایمیل')}<input name="email" type="email" dir="ltr" autoComplete="email" required maxLength={200}/></label></div>
      <label>{t('Inquiry type', 'نوع درخواست')}<select name="type">{[t('General inquiry', 'درخواست عمومی'), t('Professional collaboration', 'همکاری حرفه‌ای'), t('Research collaboration', 'همکاری پژوهشی')].map(option => <option key={option}>{option}</option>)}</select></label>
      <label>{t('Subject', 'موضوع')}<input name="subject" required maxLength={200}/></label>
      <label>{t('Message', 'پیام')}<textarea name="message" rows={7} required maxLength={10000}/></label>
      <div><button className="primary-button" type="submit">{t('Download inquiry draft', 'دریافت پیش‌نویس درخواست')}</button></div>
      <p className="draft-status" role="status">{saved ? t('Draft downloaded. Nothing has been sent', 'پیش‌نویس دریافت شد. پیامی ارسال نشده است') : t('Your entries stay in this page until you download or leave it', 'اطلاعات شما تا هنگام دریافت فایل یا خروج از صفحه در همین صفحه باقی می‌ماند')}</p>
    </form>
  </>;
}

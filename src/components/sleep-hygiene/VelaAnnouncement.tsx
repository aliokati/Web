import Link from 'next/link';
import type {Locale} from '@/i18n/config';

export default function VelaAnnouncement({locale}:{locale:Locale}) {
  const fa = locale === 'fa';
  const appHref = `/${locale}/sleep-hygiene/app`;
  return <>
    <section className="vela-announce" aria-labelledby="vela-announce-title">
      <div className="vela-announce-copy">
        <p className="tech-label">{fa ? 'دسترسی خصوصی · تجربه ممتاز' : 'PRIVATE ACCESS · PREMIUM EXPERIENCE'}</p>
        <h2 id="vela-announce-title">{fa ? 'ولا؛ یک فضای خصوصی برای بازیابی بهتر.' : 'VELA is a private space for better recovery.'}</h2>
        <p>{fa ? 'یک تجربه وب‌اپلیکیشن آرام و شخصی برای ثبت نشانه‌ها، فهمیدن الگوها و انتخاب قدم بعدی. اطلاعات شما ابتدا روی دستگاه می‌ماند.' : 'A calm, private web app for noticing signals, understanding patterns, and choosing the next useful step. Your information stays on your device first.'}</p>
        <div className="vela-announce-actions"><Link className="primary-button" href={appHref}>{fa ? 'ورود به فضای خصوصی ←' : 'Enter the private workspace →'}</Link><Link className="outline-button" href={`/${locale}/standards`}>{fa ? 'حریم خصوصی و داده‌ها' : 'Privacy and data architecture'}</Link></div>
        <small>{fa ? 'برای مرورگرهای مدرن طراحی شده و به‌صورت PWA قابل نصب است.' : 'Designed for modern browsers and installable as a PWA.'}</small>
      </div>
      <div className="vela-announce-art" aria-hidden="true"><div className="vela-announce-orbit orbit-one"/><div className="vela-announce-orbit orbit-two"/><div className="vela-announce-core"><span>VELA</span><small>RECOVERY<br/>INTELLIGENCE</small></div><i className="vela-announce-star star-one"/><i className="vela-announce-star star-two"/></div>
    </section>
    <section className="vela-announce-brief" aria-label={fa ? 'خلاصه ولا' : 'VELA at a glance'}>
      <div><p className="tech-label">{fa ? 'ساختار تجربه' : 'THE EXPERIENCE'}</p><h2>{fa ? 'کمتر، دقیق‌تر، شخصی‌تر.' : 'Less noise. More signal. More personal.'}</h2></div>
      <div className="vela-announce-steps"><article><span>01</span><h3>{fa ? 'ثبت' : 'Notice'}</h3><p>{fa ? 'ثبت سریع حال، انرژی، فشار و خواب.' : 'Capture mood, energy, load, and sleep in seconds.'}</p></article><article><span>02</span><h3>{fa ? 'فهم' : 'Understand'}</h3><p>{fa ? 'روایت‌ها با زبان محتاط و قابل فهم.' : 'Calibrated narratives with clear uncertainty.'}</p></article><article><span>03</span><h3>{fa ? 'تمرین' : 'Practice'}</h3><p>{fa ? 'یک آزمایش کوچک که واقعاً قابل ادامه است.' : 'One small experiment you can actually continue.'}</p></article></div>
    </section>
    <section className="vela-announce-trust"><div><p className="tech-label">{fa ? 'ساختار داده' : 'DATA BY DESIGN'}</p><h2>{fa ? 'تجربه ممتاز، با کنترل کامل شما.' : 'Premium by design. Private by default.'}</h2></div><div className="vela-trust-list"><span><b>01</b>{fa ? 'ذخیره روی دستگاه' : 'On-device first'}</span><span><b>02</b>{fa ? 'نسخه‌بندی هنگام همگام‌سازی' : 'Versioned sync when signed in'}</span><span><b>03</b>{fa ? 'پشتیبان‌گیری و حذف شفاف' : 'Clear export and deletion'}</span><span><b>04</b>{fa ? 'مرز روشن با تشخیص پزشکی' : 'Clear clinical boundaries'}</span></div></section>
    <section className="vela-announce-links"><p className="tech-label">{fa ? 'ساختار عمومی KRISM' : 'KRISM PUBLIC LAYER'}</p><div><Link href={`/${locale}/sleep-check`}>{fa ? 'ارزیابی خواب' : 'Sleep assessments'} ↗</Link><Link href={`/${locale}/sleep-hygiene/tools`}>{fa ? 'ابزارهای خواب' : 'Sleep tools'} ↗</Link><Link href={`/${locale}/public`}>{fa ? 'یادگیری' : 'Learning'} ↗</Link><Link href={`/${locale}/contact`}>{fa ? 'تماس' : 'Contact'} ↗</Link></div></section>
  </>;
}

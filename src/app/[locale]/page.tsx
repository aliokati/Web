import Link from 'next/link';
import {ArrowUpRight, BookOpen, ClipboardList, Moon, Stethoscope, Microscope, ArrowUpLeft} from 'lucide-react';
import {getDictionary} from '@/i18n/get-dictionary';
import type {Locale} from '@/i18n/config';
import {getRecords} from '@/lib/content';
import {RecordCards} from '@/components/site/Content';

export default async function Home({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const fa = locale === 'fa';
  const dict = await getDictionary(locale);
  const t = (en: string, persian: string) => fa ? persian : en;
  const paths = [
    {route: 'public', title: dict.hero.ctaPublic, icon: Moon, description: t('Understand your sleep. Find useful tools and a clearer next step.', 'خواب خود را بهتر بشناسید و ابزارهای کاربردی و گام بعدی مناسب را پیدا کنید.')},
    {route: 'professionals', title: dict.hero.ctaProfessional, icon: Stethoscope, description: t('Connect with the community, explore education and share knowledge.', 'با جامعه حرفه‌ای ارتباط بگیرید، منابع آموزشی را بخوانید و دانش را به اشتراک بگذارید.')},
    {route: 'research', title: dict.hero.ctaResearcher, icon: Microscope, description: t('Explore research, publications and opportunities for collaboration.', 'پژوهش‌ها، انتشارات و فرصت‌های همکاری علمی را جستجو کنید.')},
  ];
  return <main className="legacy-page balanced-home">
    <section className="home-hero">
      <div className="page-wrap home-grid">
        <div className="home-intro">
          <p className="hero-badge"><span className="status-beacon"/>{dict.hero.tagline}</p>
          <h1>{t('Sleep medicine,', 'پزشکی خواب،')}<br/><em>{t('connected.', 'متصل و یکپارچه')}</em></h1>
          <p className="hero-description">{dict.hero.description}</p>
          <div className="button-row">
            <Link className="primary-button" href={`/${locale}/sleep-check`}>{t('Start my sleep check', 'شروع ارزیابی خواب')}<ArrowUpLeft size={17}/></Link>
            <Link className="outline-button" href={`/${locale}/about`}>{t('Discover KRISM', 'آشنایی با KRISM')}</Link>
          </div>
          <div className="hero-tags"><span>{t('Science & education', 'علم و آموزش')}</span><span>{t('Community & care', 'جامعه و سلامت')}</span></div>
        </div>
        <aside className="sleep-panel">
          <div className="night-art" aria-hidden="true">
            <svg viewBox="0 0 480 250" fill="none">
              <defs><linearGradient id="moonLight" x1="160" y1="50" x2="300" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#fff2d8"/><stop offset="1" stopColor="#e0b987"/></linearGradient><linearGradient id="nightWave"><stop stopColor="#80d3d0" stopOpacity="0"/><stop offset=".5" stopColor="#80d3d0"/><stop offset="1" stopColor="#80d3d0" stopOpacity="0"/></linearGradient></defs>
              <circle cx="240" cy="123" r="96" stroke="#a9cedb" strokeOpacity=".2"/><circle cx="240" cy="123" r="119" stroke="#a9cedb" strokeOpacity=".1" strokeDasharray="3 8"/>
              <path d="M266 60a65 65 0 1 0 35 102A57 57 0 0 1 266 60Z" fill="url(#moonLight)"/>
              <path d="M20 196C68 196 74 158 112 158S159 212 202 212S256 169 296 169S350 203 393 203S439 174 460 174" stroke="url(#nightWave)" strokeWidth="2"/>
              <path d="M20 217C68 217 74 179 112 179S159 233 202 233S256 190 296 190S350 224 393 224S439 195 460 195" stroke="url(#nightWave)" strokeOpacity=".25"/>
              <g fill="#c1e7e7"><circle cx="115" cy="78" r="2"/><circle cx="329" cy="63" r="3"/><circle cx="365" cy="135" r="2"/><circle cx="174" cy="27" r="1.5"/></g>
              <path d="M348 89v12m-6-6h12M135 121v8m-4-4h8" stroke="#efcc9b" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sleep-panel-copy">
            <span className="tech-label">{t('A little clarity, a useful next step', 'شناخت بهتر، گامی آگاهانه‌تر')}</span>
            <h2>{t('How are you sleeping?', 'خوابتان چطور است؟')}</h2>
            <p>{t('Begin with the general sleep guide, then explore focused questionnaires related to your concerns.', 'از راهنمای عمومی خواب شروع کنید و سپس پرسش‌نامه‌های اختصاصی مرتبط با مشکلات خود را بررسی کنید.')}</p>
            <Link className="panel-link" href={`/${locale}/sleep-check`}>{t('General Sleep Check', 'مشاهده ۷ پرسش‌نامه اختصاصی')}<ArrowUpLeft size={17}/></Link>      <Link className="panel-link" href={`/${locale}/sleep-check/tracks`}>{t('Explore the 7 follow-up questionnaires', 'مشاهده ۷ پرسش‌نامه اختصاصی')}<ArrowUpLeft size={17}/></Link>
            <div className="hero-tags"><span>{t('No account needed', 'بدون نیاز به حساب')}</span><span>{t('Educational guidance', 'راهنمای عمومی')}</span></div>
          </div>
        </aside>
      </div>
    </section>
    <section className="section-space surface-mineral">
      <div className="page-wrap">
        <p className="tech-label">{t('FIND YOUR WAY', 'مسیر خود را پیدا کنید')}</p>
        <h2 className="section-title">{t('One community. Three ways to connect.', 'یک جامعه، سه مسیر برای ارتباط')}</h2>
        <div className="record-grid">{paths.map(({route, title, description, icon: Icon}, index) => <Link href={`/${locale}/${route}`} key={route} className={`audience-card audience-link audience-tone-${index}`}>
          <div className="audience-top"><span className="audience-icon"><Icon size={24} strokeWidth={1.5}/></span><ArrowUpRight size={20}/></div><h3>{title}</h3><p>{description}</p><span className="audience-action">{t('Explore', 'مشاهده')} {fa ? '←' : '→'}</span>
        </Link>)}</div>
      </div>
    </section>
    <section className="home-tool-section">
      <div className="page-wrap tool-shortcuts">
        <div><span className="tech-label">{t('SMALL STEPS, PRACTICAL TOOLS', 'گام‌های کوچک، ابزارهای کاربردی')}</span><h2>{t('Make room for better sleep.', 'جایی برای خواب بهتر باز کنید.')}</h2></div>
        <Link href={`/${locale}/resources/sleep-diary`}><ClipboardList size={23}/><span><strong>{t('Your sleep diary', 'دفترچه خواب شما')}</strong><small>{t('Track a week. Print your notes.', 'یک هفته را ثبت و یادداشت‌ها را چاپ کنید.')}</small></span><ArrowUpRight size={18}/></Link>
        <Link href={`/${locale}/public`}><BookOpen size={23}/><span><strong>{t('The sleep library', 'کتابخانه خواب')}</strong><small>{t('Browse topics and everyday tools.', 'موضوعات و ابزارهای روزمره را مرور کنید.')}</small></span><ArrowUpRight size={18}/></Link>
      </div>
    </section>
    <section className="section-space surface-teal">
      <div className="page-wrap"><div className="section-heading"><div><p className="tech-label">{t('SCIENCE, MADE USEFUL', 'علم کاربردی')}</p><h2 className="section-title">{t('A clearer understanding of sleep.', 'شناخت روشن‌تر خواب.')}</h2></div><Link href={`/${locale}/public`}>{t('Explore the library →', 'مشاهده کتابخانه ←')}</Link></div><RecordCards records={getRecords('awareness', locale).slice(0, 3)} locale={locale} section="awareness"/></div>
    </section>
  </main>;
}

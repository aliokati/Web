import Link from 'next/link';
import {ArrowUpRight, ArrowRight} from 'lucide-react';
import {featuredOrganizations, featuredJournals} from '@/content/affiliations';

export default function Footer({locale}: {locale: string}) {
  const fa = locale === 'fa';
  const sections = [
    {id: 'organizations', title: fa ? 'سازمان‌های علمی' : 'Scientific organizations', items: featuredOrganizations},
    {id: 'journals', title: fa ? 'مجلات منتخب خواب' : 'Selected sleep journals', items: featuredJournals},
  ];
  return <footer className="legacy-footer"><div className="page-wrap section-space">
    <div className="footer-reference-grid">{sections.map(section => <section key={section.id}>
      <div className="footer-section-heading"><h2>{section.title}</h2><Link className="footer-see-more" href={`/${locale}/affiliations#${section.id}`} aria-label={fa ? `مشاهده همه ${section.title}` : `See all ${section.title.toLowerCase()}`}>
        {fa ? 'مشاهده بیشتر' : 'See more'}<ArrowRight size={15} className="directional-arrow" aria-hidden="true"/>
      </Link></div>
      <div className="footer-links">{section.items.map(item => <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.id}><b><span dir="ltr">{item.short}</span><ArrowUpRight size={13} aria-hidden="true"/></b><span>{fa ? item.nameFa : item.name}</span></a>)}</div>
    </section>)}</div>
    <p className="footer-disclaimer">{fa ? 'پیوندهای خارجی برای دسترسی علمی ارائه شده‌اند و به‌معنای تأیید یا وابستگی رسمی نیستند' : 'External links are provided for scientific access and do not imply endorsement or formal affiliation'}</p>
    <div className="footer-bottom"><div><img src="/images/krism-logo.png" width="64" height="64" alt="KRISM"/><h2>{fa ? 'خواب بهتر، سلامت بهتر، جامعه‌ای قوی‌تر' : 'Better sleep. Better health. A stronger community'}</h2></div><nav aria-label={fa ? 'پیوندهای پایین صفحه' : 'Footer links'}>{[['about', 'About', 'درباره ما'], ['contact', 'Contact', 'تماس'], ['affiliations', 'Organizations & journals', 'سازمان‌ها و مجلات'], ['standards', 'Editorial & privacy', 'اصول محتوا و حریم خصوصی']].map(([route, en, persian]) => <Link key={route} href={`/${locale}/${route}`}>{fa ? persian : en}</Link>)}</nav></div>
    <p className="copyright">© 2026 KRISM · {fa ? 'خراسان، ایران' : 'Khorasan, Iran'}</p>
  </div></footer>;
}

import Link from 'next/link';
import CollectionExplorer from './CollectionExplorer';
import {getRecords,RecordData,sectionLabels} from '@/lib/content';
export function PageHero({title,description,eyebrow='KRISM'}:{title:string;description?:string;eyebrow?:string}) {
 return <section className="legacy-hero tech-grid-dark"><div className="page-wrap"><p className="tech-label">{eyebrow}</p><h1>{title}</h1>{description&&<p className="hero-description">{description}</p>}<div className="hero-orbits" aria-hidden="true"/></div></section>;
}
export function RecordCards({records,section,locale}:{records:RecordData[];section:string;locale:string}) {
 const fa=locale==='fa';
 return <div className="record-grid">{records.map((record,index)=><Link className="content-card record-card" href={'/'+locale+'/'+section+'/'+record.slug} key={record.slug}>
 <div className="card-meta"><span>{record.category || (sectionLabels[section]?.[fa?1:0])}</span><span>{record.readTime || String(index+1).padStart(2,'0')}</span></div>
 {record.photo&&<img className="profile-photo" src={record.photo.replace(/^\/public\//,'/')} alt={record.name||''}/>}
 <h2>{record.title||record.name}</h2><p>{record.description||record.excerpt||record.role}</p>
 {record.institution&&<p>{record.institution}</p>}
 <span className="record-action">{fa?'مطالعه بیشتر ←':'Read more →'}</span></Link>)}</div>;
}
export function CollectionPage({section,locale}:{section:string;locale:string}) {
 const fa=locale==='fa'; const records=getRecords(section,locale);
 return <main className="legacy-page"><PageHero title={sectionLabels[section]?.[fa?1:0]||section} description={fa?'دانش، آموزش و ارتباط در شبکه پزشکی خواب خراسان.':'Knowledge, education and connections across the Khorasan sleep-medicine network.'}/><section className="surface-mineral section-space"><div className="page-wrap"><CollectionExplorer records={records} section={section} locale={locale}/></div></section></main>;
}

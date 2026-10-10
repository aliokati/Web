'use client';
import {useState} from 'react';
import type {RecordData} from '@/lib/content';
import CollectionExplorer from './CollectionExplorer';

export default function ResearchHub({projects, publications, locale}: {projects: RecordData[]; publications: RecordData[]; locale: string}) {
  const [selected, setSelected] = useState<'research' | 'publications'>('research');
  const fa = locale === 'fa';
  const tabs = [{key: 'research' as const, label: fa ? 'پروژه‌ها' : 'Projects', records: projects}, {key: 'publications' as const, label: fa ? 'انتشارات' : 'Publications', records: publications}];
  const active = tabs.find(tab => tab.key === selected)!;
  return <>
    <div className="repository-tabs" role="tablist" aria-label={fa ? 'مجموعه پژوهشی' : 'Research collection'}>{tabs.map((tab, index) => <button
      type="button" role="tab" id={`tab-${tab.key}`} aria-controls={`panel-${tab.key}`} aria-selected={tab.key === selected} tabIndex={tab.key === selected ? 0 : -1} key={tab.key}
      onClick={() => setSelected(tab.key)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + 1) % tabs.length;
        setSelected(tabs[next].key);
        document.getElementById(`tab-${tabs[next].key}`)?.focus();
      }}>
      {tab.label}<span>{new Intl.NumberFormat(fa ? 'fa' : 'en').format(tab.records.length)}</span>
    </button>)}</div>
    <div role="tabpanel" id={`panel-${active.key}`} aria-labelledby={`tab-${active.key}`} tabIndex={0}>
      <CollectionExplorer key={active.key} records={active.records} section={active.key} locale={locale}/>
    </div>
  </>;
}

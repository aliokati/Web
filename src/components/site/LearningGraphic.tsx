import {Activity, Brain, Clock3, Heart, Moon, ShieldCheck, Sun, BookOpen, RefreshCw, BedDouble} from 'lucide-react';

// Conceptual labels retained from the original site's LearningGraphic component.
export default function LearningGraphic({variant, locale}: {variant?: string; locale: string}) {
  const fa = locale === 'fa';
  const t = (en: string, persian: string) => fa ? persian : en;
  const groups = {
    deprivation: {title: t('More than hours of sleep', 'خواب، فراتر از تعداد ساعت‌ها'), icons: [Clock3, Sun, Moon, BedDouble], labels: fa ? ['مدت ناکافی', 'زمان‌بندی نامناسب', 'کیفیت پایین', 'اختلال خواب'] : ['Too little', 'Wrong timing', 'Poor quality', 'Sleep disorder']},
    'health-effects': {title: t('Sleep connects the whole picture', 'خواب و سلامت همه‌جانبه'), icons: [Brain, Heart, ShieldCheck, Activity], labels: fa ? ['مغز و خلق', 'قلب و سوخت‌وساز', 'ایمنی و ترمیم', 'عملکرد و ایمنی'] : ['Brain & mood', 'Heart & metabolism', 'Immunity & repair', 'Performance & safety']},
    habits: {title: t('A rhythm for the day', 'نظمی برای روز شما'), icons: [Sun, Activity, BookOpen, Moon], labels: fa ? ['نور روز', 'فعالیت', 'آرام‌سازی', 'محیط خواب'] : ['Daylight', 'Activity', 'Wind down', 'Sleep environment']},
    'healthy-need': {title: t('Four dimensions of sleep', 'چهار بُعد خواب'), icons: [Clock3, Moon, RefreshCw, Sun], labels: fa ? ['مقدار', 'کیفیت', 'نظم', 'زمان‌بندی'] : ['Amount', 'Quality', 'Regularity', 'Timing']},
  };
  const group = groups[variant as keyof typeof groups];
  if (!group && variant !== 'body-clock') return null;
  return <figure className="learning-visual">
    <h2>{group?.title || t('Two rhythms, one sleep system', 'دو ریتم، یک سامانه خواب')}</h2>
    {group ? <div className="learning-visual-grid">{group.labels.map((label, index) => {
      const Icon = group.icons[index];
      return <div key={label} className="learning-visual-cell"><span className="learning-number">{new Intl.NumberFormat(fa ? 'fa' : 'en').format(index + 1)}</span><Icon size={29} strokeWidth={1.4} aria-hidden="true"/><strong>{label}</strong></div>;
    })}</div> : <>
      <svg viewBox="0 0 720 260" className="body-clock-visual" role="img" aria-label={t('Conceptual curves for sleep pressure and circadian timing', 'نمودار مفهومی فشار خواب و زمان‌بندی شبانه‌روزی')}>
        <path d="M20 210 C170 205 260 150 370 62 C470 5 560 55 700 135" fill="none" stroke="#387f85" strokeWidth="5" strokeLinecap="round"/>
        <path d="M20 135 C120 20 230 26 350 135 C470 245 580 238 700 135" fill="none" stroke="#a77b4d" strokeWidth="3" strokeDasharray="10 10" strokeLinecap="round"/>
        <circle cx="370" cy="62" r="7" fill="#387f85"/><circle cx="700" cy="135" r="6" fill="#a77b4d"/>
      </svg>
      <div className="learning-legend"><span>{t('Solid: sleep pressure', 'خط پیوسته: فشار خواب')}</span><span>{t('Dashed: circadian timing', 'خط‌چین: زمان‌بندی شبانه‌روزی')}</span></div>
    </>}
    <figcaption>{t('A conceptual learning visual from KRISM; not a clinical measurement.', 'تصویر مفهومی آموزشی KRISM؛ برای یادگیری و نه اندازه‌گیری بالینی.')}</figcaption>
  </figure>;
}

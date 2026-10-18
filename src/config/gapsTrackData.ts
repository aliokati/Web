import { TrackQuestion, TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const GAPS_QUESTIONS: TrackQuestion[] = [
  { 
    id: "gaps_ambulation", 
    type: "scale-4", 
    textEn: "How often have you engaged in complex physical activities during sleep (e.g., walking, moving furniture)?", 
    textFa: "هر چند وقت یک‌بار رفتارهای حرکتی پیچیده حین خواب (مانند راه رفتن در خواب، جابجا کردن وسایل) داشته‌اید؟" 
  },
  { 
    id: "gaps_vocalization", 
    type: "scale-4", 
    textEn: "How frequently do you talk loudly, shout, or display intense emotional vocalizations during sleep?", 
    textFa: "هر چند وقت یک‌بار در خواب با صدای بلند صحبت می‌کنید، فریاد می‌زنید یا صداهای شدید احساسی از خود بروز می‌دهید؟" 
  },
  { 
    id: "gaps_dream_enactment", 
    type: "scale-4", 
    textEn: "How often do you physically act out vivid or violent dreams (e.g., punching, kicking, thrashing)?", 
    textFa: "هر چند وقت یک‌بار رویاهای واضح یا خشونت‌آمیز خود را به صورت فیزیکی اجرا می‌کنید (مانند مشت زدن، لگد زدن، دست و پا زدن)؟" 
  },
  { 
    id: "gaps_injury", 
    type: "scale-4", 
    textEn: "Have these nocturnal behaviors resulted in self-injury or injury to a bed partner?", 
    textFa: "آیا این رفتارهای شبانه منجر به آسیب رساندن به خودتان یا شریک خوابتان شده است؟" 
  }
];

export const GAPS_INTERPRETATION: TrackScoreInterpretation[] = [
  { 
    minScore: 0, 
    maxScore: 3, 
    severityEn: "Low / Isolated Parasomnia Indicators", 
    severityFa: "شاخص‌های پاراسومنیای پایین / ایزوله", 
    actionEn: "No current evidence of severe behavioral sleep disruption",
    actionFa: "شواهدی از اختلال رفتاری شدید حین خواب در حال حاضر مشاهده نمی‌شود"
  },
  { 
    minScore: 4, 
    maxScore: 9, 
    severityEn: "Moderate / Sub-clinical Parasomnia Activity", 
    severityFa: "فعالیت پاراسومنیای متوسط / تحت‌بالینی", 
    actionEn: "Ensure sleep environment safety (e.g., secure windows, clear floors). Medical observation recommended",
    actionFa: "ایمنی محیط خواب (قفل کردن پنجره‌ها، تخلیه کف اتاق) را تامین کنید. نظارت پزشکی توصیه می‌شود"
  },
  { 
    minScore: 10, 
    maxScore: 16, 
    severityEn: "Severe / Pathological Parasomnia Profile", 
    severityFa: "پروفایل پاراسومنیای شدید / پاتولوژیک", 
    actionEn: "Urgent evaluation required by a neurologist or sleep specialist to rule out REM Sleep Behavior Disorder",
    actionFa: "ارزیابی فوری توسط متخصص اعصاب یا فلوشیپ طب خواب جهت رد اختلال رفتاری خواب REM الزامی است"
  }
];

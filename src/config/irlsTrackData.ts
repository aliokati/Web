import { TrackQuestion, TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const IRLS_QUESTIONS: TrackQuestion[] = [
  { 
    id: "irls_urge", 
    type: "scale-4", 
    textEn: "How severe is the urge to move your legs when you are resting or sitting quietly?", 
    textFa: "تمایل و نیاز اجباری شما به حرکت دادن پاها هنگام استراحت یا نشستن آرام چقدر شدید است؟" 
  },
  { 
    id: "irls_relief", 
    type: "scale-4", 
    textEn: "How much relief from the uncomfortable leg sensations do you get from moving around or walking?", 
    textFa: "حرکت دادن پاها یا راه رفتن چقدر باعث تسکین احساس ناخوشایند در پاهای شما می‌شود؟" 
  },
  { 
    id: "irls_sleep_disturb", 
    type: "scale-4", 
    textEn: "How severe is the sleep disruption caused by your restless legs symptoms?", 
    textFa: "اختلال خواب ناشی از علائم پاهای بی‌قرار شما چقدر شدید است؟" 
  },
  { 
    id: "irls_fatigue", 
    type: "scale-4", 
    textEn: "How severe is your daytime tiredness or fatigue related to your leg symptoms?", 
    textFa: "خستگی یا فرسودگی روزانه شما به دلیل وجود این علائم حرکتی پا چقدر شدید است؟" 
  }
];

export const IRLS_INTERPRETATION: TrackScoreInterpretation[] = [
  { minScore: 0, maxScore: 4, severityEn: "Mild movement indices", severityFa: "شاخص‌های حرکتی خفیف", actionEn: "Monitor iron stores (Ferritin) and maintain walking regimens.", actionFa: "ذخایر آهن خون (فریتین) را پایش کرده و فعالیت‌های منظم پیاده‌روی را حفظ کنید." },
  { minScore: 5, maxScore: 10, severityEn: "Moderate Restless Legs Syndrome", severityFa: "سندروم پاهای بی‌قرار متوسط", actionEn: "Clinical review advised. Check secondary contributors (e.g., renal indices, peripheral neuro-profiles).", actionFa: "بررسی بالینی پیشنهاد می‌شود. عوامل ثانویه (مانند فاکتورهای کلیوی و عصبی محیطی) پایش شوند." },
  { minScore: 11, maxScore: 16, severityEn: "Severe Restless Legs Disruption", severityFa: "سندروم پاهای بی‌قرار شدید بالینی", actionEn: "Requires professional clinical management. Evaluation for dopaminergic or alpha-2-delta ligand strategies.", actionFa: "نیازمند مدیریت دارویی و بالینی تخصصی توسط فلوشیپ طب خواب یا متخصص مغز و اعصاب می‌باشد." }
];

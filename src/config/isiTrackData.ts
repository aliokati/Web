import { TrackQuestion, TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const ISI_QUESTIONS: TrackQuestion[] = [
  { id: "isi_onset", type: "scale-4", textEn: "Difficulty falling asleep:", textFa: "شدت مشکل در به خواب رفتن:" },
  { id: "isi_maintenance", type: "scale-4", textEn: "Difficulty staying asleep:", textFa: "شدت مشکل در بیدار شدن طی شب و تداوم خواب:" },
  { id: "isi_early", type: "scale-4", textEn: "Problem waking up too early:", textFa: "شدت مشکل در خیلی زود بیدار شدن از خواب:" },
  { id: "isi_satisfaction", type: "scale-4", textEn: "How satisfied/dissatisfied are you with your current sleep pattern?", textFa: "چقدر از الگوی خواب فعلی خود رضایت یا نارضایتی دارید؟" },
  { id: "isi_interference", type: "scale-4", textEn: "How much does your sleep problem interfere with your daily functioning?", textFa: "مشکل خواب شما چقدر در عملکرد روزانه شما اختلال ایجاد می‌کند؟" },
  { id: "isi_noticeable", type: "scale-4", textEn: "How noticeable to others do you think your sleep problem is?", textFa: "به نظر شما مشکل خوابتان چقدر توجه دیگران را جلب کرده و عیان است؟" },
  { id: "isi_worry", type: "scale-4", textEn: "How worried/distressed are you about your current sleep problem?", textFa: "چقدر در مورد مشکل خواب فعلی خود نگران هستید یا زجر می‌کشید؟" }
];

export const ISI_INTERPRETATION: TrackScoreInterpretation[] = [
  { minScore: 0, maxScore: 7, severityEn: "No clinically significant insomnia", severityFa: "بدون بی‌خوابی بالینی معنادار", actionEn: "Maintain optimal sleep hygiene", actionFa: "بهداشت خواب بهینه خود را حفظ کنید" },
  { minScore: 8, maxScore: 14, severityEn: "Subthreshold insomnia", severityFa: "بی‌خوابی خفیف (زیر آستانه بالینی)", actionEn: "Consider sleep scheduling and minor stress reduction profiles", actionFa: "تنظیم جدول زمانی خواب و کاهش استرس‌های جزئی پیشنهاد می‌شود" },
  { minScore: 15, maxScore: 21, severityEn: "Clinical insomnia (Moderate severity)", severityFa: "بی‌خوابی بالینی (شدت متوسط)", actionEn: "Highly recommended to initiate digital CBT-I protocols with a sleep psychologist", actionFa: "اکیداً پیشنهاد می‌شود پروتکل‌های درمان شناختی رفتاری (CBT-I) را آغاز کنید" },
  { minScore: 22, maxScore: 28, severityEn: "Clinical insomnia (Severe)", severityFa: "بی‌خوابی بالینی شدید", actionEn: "Urgent consultation required with a sleep specialist or psychiatrist", actionFa: "نیاز به مراجعه فوری به فلوشیپ طب خواب یا روان‌پزشک جهت ارزیابی‌های پیشرفته وجود دارد" }
];

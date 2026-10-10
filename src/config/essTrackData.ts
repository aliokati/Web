import { TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const ESS_QUESTIONS = [
  {
    id: "ess_1",
    textEn: "Sitting and reading:",
    textFa: "نشستن و کتاب خواندن/مطالعه کردن:",
  },
  {
    id: "ess_2",
    textEn: "Watching television:",
    textFa: "تماشای تلویزیون:",
  },
  {
    id: "ess_3",
    textEn: "Sitting inactive in a public place (e.g., a theater or a meeting):",
    textFa: "نشستن بدون فعالیت در یک مکان عمومی (مانند سینما، تئاتر یا جلسه):",
  },
  {
    id: "ess_4",
    textEn: "As a passenger in a car for an hour without a break:",
    textFa: "به عنوان مسافر در یک خودرو به مدت یک ساعت بدون توقف:",
  },
  {
    id: "ess_5",
    textEn: "Lying down to rest in the afternoon when circumstances permit:",
    textFa: "دراز کشیدن و استراحت عصرگاهی در صورتی که شرایط فراهم باشد:",
  },
  {
    id: "ess_6",
    textEn: "Sitting and talking to someone:",
    textFa: "نشستن و صحبت کردن با یک فرد دیگر:",
  },
  {
    id: "ess_7",
    textEn: "Sitting quietly after a lunch without alcohol:",
    textFa: "نشستن در آرامش پس از صرف ناهار (بدون مصرف الکل):",
  },
  {
    id: "ess_8",
    textEn: "In a car, while stopped for a few minutes in traffic:",
    textFa: "در خودرو، در حالی که برای چند دقیقه پشت ترافیک متوقف شده‌اید:"
  }
];

export const ESS_OPTIONS = [
  { score: 0, textEn: "Would never doze", textFa: "هرگز چرت نخواهم زد" },
  { score: 1, textEn: "Slight chance of dozing", textFa: "احتمال کمی وجود دارد" },
  { score: 2, textEn: "Moderate chance of dozing", textFa: "احتمال متوسطی وجود دارد" },
  { score: 3, textEn: "High chance of dozing", textFa: "احتمال بالایی برای چرت زدن وجود دارد" }
];

export const ESS_INTERPRETATION = [
  { minScore: 0, maxScore: 5, severityEn: "Lower normal daytime sleepiness", severityFa: "خواب‌آلودگی روزانه طبیعی، سطح پایین", actionEn: "This score is in the lower normal range. Interpret it with your symptoms and safety context.", actionFa: "این امتیاز در محدوده طبیعی پایین قرار دارد و باید همراه با علائم و وضعیت ایمنی تفسیر شود." },
  { minScore: 6, maxScore: 10, severityEn: "Higher normal daytime sleepiness", severityFa: "خواب‌آلودگی روزانه طبیعی، سطح بالاتر", actionEn: "This score is still within the higher normal range; review symptoms if sleepiness affects daily activities.", actionFa: "این امتیاز هنوز در محدوده طبیعی بالاتر است؛ اگر خواب‌آلودگی بر فعالیت‌های روزانه اثر دارد، علائم را بررسی کنید." },
  { minScore: 11, maxScore: 12, severityEn: "Mild excessive daytime sleepiness", severityFa: "خواب‌آلودگی روزانه بیش از حد، خفیف", actionEn: "Discuss persistent sleepiness with a clinician, especially if it affects driving, work or safety.", actionFa: "در صورت تداوم خواب‌آلودگی، به‌ویژه اگر بر رانندگی، کار یا ایمنی اثر دارد، با پزشک گفت‌وگو کنید." },
  { minScore: 13, maxScore: 15, severityEn: "Moderate excessive daytime sleepiness", severityFa: "خواب‌آلودگی روزانه بیش از حد، متوسط", actionEn: "Discuss persistent sleepiness with a clinician, especially if it affects driving, work or safety.", actionFa: "در صورت تداوم خواب‌آلودگی، به‌ویژه اگر بر رانندگی، کار یا ایمنی اثر دارد، با پزشک گفت‌وگو کنید." },
  { minScore: 16, maxScore: 24, severityEn: "Severe excessive daytime sleepiness", severityFa: "خواب‌آلودگی مفرط بالینی و شدید", actionEn: "Urgent sleep assessment required. Avoid operating heavy machinery or driving.", actionFa: "ارزیابی فوری خواب الزامی است. از رانندگی و کار با ماشین‌آلات سنگین خودداری کنید." }
];

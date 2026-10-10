export const PSQI_QUESTIONS = [
  {
    id: "psqi_1",
    textEn: "During the past month, how would you rate your sleep quality overall?",
    textFa: "طی یک ماه گذشته، کیفیت کلی خواب خود را چگونه ارزیابی می‌کنید؟",
    options: [
      { score: 0, textEn: "Very good", textFa: "بسیار عالی" },
      { score: 1, textEn: "Fairly good", textFa: "نسبتاً خوب" },
      { score: 2, textEn: "Fairly bad", textFa: "نسبتاً بد" },
      { score: 3, textEn: "Very bad", textFa: "بسیار بد و نامطلوب" }
    ]
  },
  {
    id: "psqi_2",
    textEn: "During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?",
    textFa: "طی یک ماه گذشته، هر چند وقت یک‌بار به دلیل بیدار شدن در میانه شب یا اوایل صبح دچار مشکل خواب شده‌اید؟",
    options: [
      { score: 0, textEn: "Not during the past month", textFa: "در طول یک ماه گذشته رخ نداده است" },
      { score: 1, textEn: "Less than once a week", textFa: "کمتر از یک بار در هفته" },
      { score: 2, textEn: "Once or twice a week", textFa: "یک یا دو بار در هفته" },
      { score: 3, textEn: "Three or more times a week", textFa: "سه بار یا بیشتر در هفته" }
    ]
  },
  {
    id: "psqi_3",
    textEn: "During the past month, how often have you taken medicine to help you sleep (prescribed or over-the-counter)?",
    textFa: "طی یک ماه گذشته، هر چند وقت یک‌بار از داروهای کمکی خواب (تجویزی یا بدون نسخه) استفاده کرده‌اید؟",
    options: [
      { score: 0, textEn: "Not during the past month", textFa: "در طول یک ماه گذشته مصرف نکرده‌ام" },
      { score: 1, textEn: "Less than once a week", textFa: "کمتر از یک بار در هفته" },
      { score: 2, textEn: "Once or twice a week", textFa: "یک یا دو بار در هفته" },
      { score: 3, textEn: "Three or more times a week", textFa: "سه بار یا بیشتر در هفته" }
    ]
  }
];

export const PSQI_INTERPRETATION = [
  { minScore: 0, maxScore: 4, severityEn: "Good sleep quality status", severityFa: "کیفیت خواب مطلوب و بستر فیزیولوژیک سالم", actionEn: "Your behavioral architectural framework is functioning correctly.", actionFa: "ساختار رفتاری و بستر فیزیولوژیک خواب شما به درستی کار می‌کند." },
  { minScore: 5, maxScore: 9, severityEn: "Poor sleep quality profiles", severityFa: "کیفیت خواب نامطلوب و مخدوش", actionEn: "A medical score above 5 suggests significant sleep quality disruption. Clinical tracking is advised.", actionFa: "کسب نمره بالاتر از ۵ نشان‌دهنده نقص جدی در کیفیت خواب است. ارزیابی رفتاری توصیه می‌شود." }
];

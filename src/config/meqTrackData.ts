export const MEQ_QUESTIONS = [
  {
    id: "meq_1",
    textEn: "Considering only your own best rhythm, what time would you get up if you were entirely free to plan your day?",
    textFa: "تنها با در نظر گرفتن ریتم بدنی خودتان، اگر کاملاً در برنامه‌ریزی روز آزاد بودید چه ساعتی از خواب بیدار می‌شدید؟",
    options: [
      { score: 5, textEn: "5:00 AM - 6:30 AM", textFa: "۰۵:۰۰ تا ۰۶:۳۰ صبح" },
      { score: 4, textEn: "6:30 AM - 7:45 AM", textFa: "۰۶:۳۰ تا ۰۷:۴۵ صبح" },
      { score: 3, textEn: "7:45 AM - 9:45 AM", textFa: "۰۷:۴۵ تا ۰۹:۴۵ صبح" },
      { score: 2, textEn: "9:45 AM - 11:00 AM", textFa: "۰۹:۴۵ تا ۱۱:۰۰ صبح" },
      { score: 1, textEn: "11:00 AM - 12:00 PM (Noon)", textFa: "۱۱:۰۰ صبح تا ۱۲:۰۰ ظهر" }
    ]
  },
  {
    id: "meq_2",
    textEn: "During the first half-hour after you wake up in the morning, how tired do you feel?",
    textFa: "در طول نیم ساعت اول پس از بیدار شدن از خواب در صبح، چقدر احساس خستگی می‌کنید؟",
    options: [
      { score: 1, textEn: "Very tired", textFa: "بسیار خسته و فرسوده" },
      { score: 2, textEn: "Fairly tired", textFa: "تا حدودی خسته" },
      { score: 3, textEn: "Fairly refreshed", textFa: "تا حدودی سرحال و باانرژی" },
      { score: 4, textEn: "Very refreshed", textFa: "کاملاً سرحال و پرانرژی" }
    ]
  },
  {
    id: "meq_3",
    textEn: "At what time in the evening do you feel tired and as a result in need of sleep?",
    textFa: "چه ساعتی در شب احساس خستگی می‌کنید و در نتیجه نیاز به خواب رفتن دارید؟",
    options: [
      { score: 5, textEn: "8:00 PM - 9:00 PM", textFa: "۰۸:۰۰ تا ۰۹:۰۰ شب" },
      { score: 4, textEn: "9:00 PM - 10:15 PM", textFa: "۰۹:۰۰ تا ۱۰:۱۵ شب" },
      { score: 3, textEn: "10:15 PM - 12:30 AM", textFa: "۱۰:۱۵ شب تا ۱۲:۳۰ بامداد" },
      { score: 2, textEn: "12:30 AM - 1:45 AM", textFa: "۱۲:۳۰ بامداد تا ۰۱:۴۵ شب" },
      { score: 1, textEn: "1:45 AM - 3:00 AM", textFa: "۰۱:۴۵ تا ۰۳:۰۰ بامداد" }
    ]
  }
];

export const MEQ_INTERPRETATION = [
  { minScore: 3, maxScore: 5, severityEn: "Definite Evening Type (Owl)", severityFa: "تیپ شب‌زنده‌دار قطعی (جغد شب)", actionEn: "High vulnerability to social jetlag. Consider chronotherapy or specialized bright light therapy configurations.", actionFa: "آسیب‌پذیری بالا نسبت به جت‌لگ اجتماعی. استفاده از چرخه‌های نوردرمانی تخصصی توصیه می‌شود." },
  { minScore: 6, maxScore: 11, severityEn: "Intermediate Type (Neutral)", severityFa: "تیپ خنثی / میانه", actionEn: "Flexible sleep window layout options.", actionFa: "انعطاف‌پذیری مناسب در بازه‌های زمانی خواب و بیداری عمومی." },
  { minScore: 12, maxScore: 14, severityEn: "Definite Morning Type (Lark)", severityFa: "تیپ سحرخیز قطعی (چکاوک صبح)", actionEn: "Optimal structural peak alertness aligns with early light values.", actionFa: "اوج سطح هوشیاری شما کاملاً هماهنگ با ساعات اولیه طلوع خورشید و صبح است." }
];

import { TrackQuestion, TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const IRLS_QUESTIONS: TrackQuestion[] = [
  { id: "q1", type: "scale-4", textEn: "Overall, how would you rate the discomfort in your legs or arms from your restless legs symptoms?", textFa: "به طور کلی ناراحتی پاها یا دست‌های شما ناشی از علائم پاهای بی‌قرار چقدر است؟" },
  { id: "q2", type: "scale-4", textEn: "How strong is your need to move around because of your restless legs symptoms?", textFa: "نیاز شما به حرکت کردن به دلیل علائم پاهای بی‌قرار چقدر شدید است؟" },
  { id: "q3", type: "scale-4", textEn: "How much relief do you get from moving around?", textFa: "حرکت کردن چه مقدار علائم شما را تسکین می‌دهد؟" },
  { id: "q4", type: "scale-4", textEn: "How severe is the sleep disturbance from your restless legs symptoms?", textFa: "اختلال خواب ناشی از علائم پاهای بی‌قرار چقدر شدید است؟" },
  { id: "q5", type: "scale-4", textEn: "How severe is your tiredness or sleepiness during the day from your symptoms?", textFa: "خستگی یا خواب‌آلودگی روزانه شما به دلیل این علائم چقدر شدید است؟" },
  { id: "q6", type: "scale-4", textEn: "How severe is your restless legs condition as a whole?", textFa: "وضعیت پاهای بی‌قرار شما در مجموع چقدر شدید است؟" },
  { id: "q7", type: "scale-4", textEn: "How often do you get restless legs symptoms?", textFa: "علائم پاهای بی‌قرار را چند وقت یک‌بار تجربه می‌کنید؟" },
  { id: "q8", type: "scale-4", textEn: "When you have symptoms, how severe are they on average during a 24-hour day?", textFa: "وقتی علائم دارید، شدت متوسط آن‌ها در طول یک شبانه‌روز چقدر است؟" },
  { id: "q9", type: "scale-4", textEn: "How severe is the impact of your restless legs symptoms on your daily affairs?", textFa: "تأثیر علائم پاهای بی‌قرار بر کارهای روزمره شما چقدر شدید است؟" },
  { id: "q10", type: "scale-4", textEn: "How severe is the disturbance of your mood from your restless legs symptoms?", textFa: "اختلال خلق شما به دلیل علائم پاهای بی‌قرار چقدر شدید است؟" },
];

export const IRLS_LABELS = [
  { en: "None", fa: "هیچ" }, { en: "Mild", fa: "خفیف" }, { en: "Moderate", fa: "متوسط" }, { en: "Severe", fa: "شدید" }, { en: "Very severe", fa: "بسیار شدید" },
];
export const IRLS_INTERPRETATION: TrackScoreInterpretation[] = [
  { minScore: 0, maxScore: 10, severityEn: "Mild severity", severityFa: "شدت خفیف", actionEn: "This score describes symptom severity only. Review persistent or disruptive symptoms with a clinician.", actionFa: "این امتیاز فقط شدت علائم را توصیف می‌کند. علائم پایدار یا مختل‌کننده را با پزشک بررسی کنید." },
  { minScore: 11, maxScore: 20, severityEn: "Moderate severity", severityFa: "شدت متوسط", actionEn: "Consider a clinical review, especially if sleep or daytime function is affected.", actionFa: "به‌ویژه اگر خواب یا عملکرد روزانه مختل شده است، ارزیابی بالینی را در نظر بگیرید." },
  { minScore: 21, maxScore: 30, severityEn: "Severe severity", severityFa: "شدت شدید", actionEn: "Arrange a clinical review to discuss symptoms, causes and treatment options.", actionFa: "برای بررسی علائم، علل و گزینه‌های درمانی با پزشک مشورت کنید." },
  { minScore: 31, maxScore: 40, severityEn: "Very severe", severityFa: "شدت بسیار شدید", actionEn: "Prompt clinical review is recommended; this result is not a diagnosis.", actionFa: "ارزیابی بالینی سریع توصیه می‌شود؛ این نتیجه تشخیص پزشکی نیست." },
];

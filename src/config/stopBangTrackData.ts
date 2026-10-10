import { TrackQuestion } from "@/types/diagnostic-tracks";

export const STOP_BANG_QUESTIONS: TrackQuestion[] = [
  { id: "sb_snore", type: "boolean", textEn: "Do you Snore Loudly (louder than talking or loud enough to be heard through closed doors)?", textFa: "آیا با صدای بلند خروپف می‌کنید (بلندتر از صدای صحبت کردن یا در حدی که از پشت درهای بسته شنیده شود)؟" },
  { id: "sb_tired", type: "boolean", textEn: "Do you often feel Tired, fatigued, or sleepy during the daytime?", textFa: "آیا اغلب در طول روز احساس خستگی مفرط، فرسودگی یا خواب‌آلودگی شدید دارید؟" },
  { id: "sb_observed", type: "boolean", textEn: "Has anyone Observed you stop breathing or choking/gasping during your sleep?", textFa: "آیا تا به حال کسی متوجه قطع شدن تنفس، خفگی یا نفس‌نفس زدن شما در خواب شده است؟" },
  { id: "sb_pressure", type: "boolean", textEn: "Do you have or are you being treated for High Blood Pressure?", textFa: "آیا مبتلا به فشار خون بالا هستید یا برای آن تحت درمان دارویی قرار دارید؟" },
  { id: "sb_bmi", type: "boolean", textEn: "Is your Body Mass Index (BMI) more than 35 kg/m²?", textFa: "آیا شاخص توده بدنی (BMI) شما بیشتر از ۳۵ کیلوگرم بر متر مربع است؟" },
  { id: "sb_age", type: "boolean", textEn: "Are you older than 50 years of age?", textFa: "آیا سن شما بیشتر از ۵۰ سال است؟" },
  { id: "sb_neck", type: "boolean", textEn: "Is your neck circumference greater than 40 cm (16 inches)?", textFa: "آیا دور گردن شما بیشتر از ۴۰ سانتی‌متر (۱۶ اینچ) است؟" },
  { id: "sb_gender", type: "boolean", textEn: "Is your biological gender male?", textFa: "آیا جنسیت بیولوژیک شما مرد است؟" }
];

import { Question } from "@/types/sleep-check";

export const SCREENING_QUESTIONS: Question[] = [
  {
    id: "ins_core",
    category: "insomnia",
    textEn: "Over the past 2 weeks, how severe have you found your problems with sleep onset (falling asleep) or sleep maintenance (waking up during the night)? [Based on ISI]",
    textFa: "طی دو هفته گذشته، مشکلات شما در شروع خواب (به خواب رفتن) یا تداوم خواب (بیدار شدن در میان شب) چقدر شدید بوده است؟ [بر اساس شاخص شدت بی‌خوابی ISI]",
    weight: 1.2
  },
  {
    id: "apn_core",
    category: "apnea",
    textEn: "Do you experience loud snoring, observed gasping, or choking events accompanied by unrefreshing daytime fatigue? [Based on STOP-BANG]",
    textFa: "آیا خروپف شدید، نفس‌نفس زدن واضح یا احساس خفگی در خواب همراه با خستگی مفرط روزانه را تجربه می‌کنید؟ [بر اساس غربالگری STOP-BANG]",
    weight: 1.5
  },
  {
    id: "cir_core",
    category: "circadian",
    textEn: "Does your preferred sleep timing clash severely with societal, social, or occupational demands (e.g., severe jet lag sensations without traveling)? [Based on MEQ Context]",
    textFa: "آیا زمان ایده‌آل خواب شما با الزامات اجتماعی، خانوادگی یا شغلی تداخل شدیدی دارد (مانند احساس پرواززدگی شدید بدون مسافرت)؟ [بر اساس ساختار MEQ]",
    weight: 1.0
  },
  {
    id: "par_core",
    category: "parasomnia",
    textEn: "Have you or others noticed disruptive behaviors during sleep, such as sleepwalking, night terrors, or acting out complex vivid dreams? [Based on GAPS]",
    textFa: "آیا خودتان یا دیگران متوجه رفتارهای غیرعادی در خواب مانند راه رفتن در خواب، وحشت شبانه یا اجرای فیزیکی رویاهای واضح شده‌اید؟ [بر اساس مقیاس GAPS]",
    weight: 1.4
  },
  {
    id: "mov_core",
    category: "movement",
    textEn: "Do you experience an irresistible urge to move your legs, usually accompanied by uncomfortable creeping sensations that worsen during evening rest? [Based on IRLS]",
    textFa: "آیا تمایل غیرقابل مقاومتی برای حرکت دادن پاهای خود دارید که معمولاً با احساسات ناخوشایند در عمق ساق پا همراه است و هنگام استراحت عصرگاهی تشدید می‌شود؟ [بر اساس مقیاس بین‌المللی IRLS]",
    weight: 1.3
  },
  {
    id: "hyp_core",
    category: "hypersomnia",
    textEn: "How likely are you to doze off or fall asleep during routine daytime activities like sitting quietly, reading, or watching public media? [Based on ESS]",
    textFa: "چقدر احتمال دارد که در طول فعالیت‌های معمول روزانه مانند نشستن در محیطی آرام، مطالعه یا تماشای رسانه‌ها ناخواسته به خواب بروید؟ [بر اساس مقیاس خواب‌آلودگی Epworth]",
    weight: 1.1
  }
];

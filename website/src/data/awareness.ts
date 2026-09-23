export interface AwarenessArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "Sleep Health" | "Sleep Disorders" | "Healthy Sleep";
  featured?: boolean;
}

export const awarenessArticles: AwarenessArticle[] = [
  {
    slug: "why-sleep-matters",
    title: "Why Sleep Matters",
    excerpt:
      "Sleep is an essential part of physical health, cognitive function, emotional well-being and overall quality of life.",
    category: "Sleep Health",
    featured: true,
    content: [
      "Sleep is a fundamental biological process that supports many aspects of health and daily functioning.",
      "Adequate and good-quality sleep contributes to attention, memory, learning, emotional regulation and physical recovery.",
      "Persistent difficulties with sleep should not simply be accepted as a normal part of life. When sleep problems are frequent or interfere with daily activities, professional evaluation may be appropriate.",
    ],
  },
  {
    slug: "healthy-sleep-habits",
    title: "Healthy Sleep Habits",
    excerpt:
      "Simple and consistent habits can support a regular sleep schedule and a healthier sleep environment.",
    category: "Healthy Sleep",
    featured: true,
    content: [
      "Keeping a relatively consistent sleep and wake schedule can help support regular sleep patterns.",
      "A comfortable, quiet and appropriately dark sleep environment may make it easier to sleep.",
      "Regular physical activity and thoughtful use of caffeine, nicotine and other stimulating substances can also influence sleep.",
      "Individual sleep needs vary. Persistent or severe sleep difficulties may require assessment by a qualified healthcare professional.",
    ],
  },
  {
    slug: "when-to-seek-help-for-sleep-problems",
    title: "When to Seek Professional Help",
    excerpt:
      "Some sleep problems are temporary, while persistent symptoms may warrant professional evaluation.",
    category: "Sleep Disorders",
    featured: true,
    content: [
      "Occasional difficulty sleeping can occur for many reasons. Persistent problems deserve closer attention.",
      "Loud habitual snoring, witnessed pauses in breathing, excessive daytime sleepiness, persistent insomnia or unusual nighttime behaviors can be reasons to discuss sleep with a healthcare professional.",
      "A healthcare professional can determine whether further assessment or specialized sleep evaluation is appropriate.",
    ],
  },
];
"use client";

import { useState } from "react";
import { Locale } from "@/i18n/config";
import { Articles } from "@/types/education";
import { BookOpen, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LibraryProps {
  locale: Locale;
  articles: Articles[];
  labels: {
    all: string;
    habits: string;
    science: string;
    disorders: string;
    readMore: string;
    empty: string;
  };
}

export default function SleepLibrary({ locale, articles, labels }: LibraryProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const isRtl = locale === "fa";

  const categories = [
    { id: "all", label: labels.all },
    { id: "habits", label: labels.habits },
    { id: "science", label: labels.science },
    { id: "disorders", label: labels.disorders },
  ];

  const filteredArticles = activeTab === "all" 
    ? articles 
    : articles.filter(art => art.category === activeTab);

  return (
    <div className="w-full space-y-8">
      {/* Category Navigation Track */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
              activeTab === cat.id
                ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
                : "border-slate-800 bg-slate-950/20 text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Article Grid Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((art) => (
            <motion.article
              layout
              key={art.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-slate-700/60 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-500">
                  <span className="uppercase text-sky-400 px-2 py-0.5 rounded bg-sky-500/5 border border-sky-500/10">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isRtl ? art.readTimeFa : art.readTimeEn}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 leading-snug">
                  {isRtl ? art.titleFa : art.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isRtl ? art.excerptFa : art.excerptEn}
                </p>
              </div>

              <div className="pt-2">
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors group">
                  {labels.readMore}
                  {isRtl ? (
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
          {labels.empty}
        </div>
      )}
    </div>
  );
}

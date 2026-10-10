"use client";

import { useState } from "react";
import { Locale } from "@/i18n/config";
import { Publication } from "@/types/research";
import { FileText, Download, Calendar, ExternalLink, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RepositoryProps {
  locale: Locale;
  publications: Publication[];
  labels: {
    allCategories: string;
    clinicalTrial: string;
    epidemiology: string;
    review: string;
    downloadBtn: string;
    emptyState: string;
  };
}

export default function ResearchRepository({ locale, publications, labels }: RepositoryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isRtl = locale === "fa";

  const categories = [
    { id: "all", label: labels.allCategories },
    { id: "clinical-trial", label: labels.clinicalTrial },
    { id: "epidemiology", label: labels.epidemiology },
    { id: "review", label: labels.review },
  ];

  // Refine listing by user selected taxonomy parameter
  const filteredPapers = activeCategory === "all" 
    ? publications 
    : publications.filter(paper => paper.category === activeCategory);

  return (
    <div className="w-full space-y-8">
      {/* Category Selection Filter Track */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-900 pb-6">
        <Filter className="w-4 h-4 text-slate-500 mr-2 ml-2" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
              activeCategory === cat.id
                ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
                : "border-slate-800/80 bg-slate-950/20 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Publications Listing Panel */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPapers.map((paper) => (
            <motion.div
              layout
              key={paper.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md hover:border-slate-700/60 transition-all flex flex-col sm:flex-row justify-between items-start gap-6"
            >
              <div className="space-y-3 flex-grow max-w-4xl">
                {/* Structural Abstract Meta Badges */}
                <div className="flex items-center gap-3 text-[11px] font-mono tracking-wide text-slate-500">
                  <span className="uppercase text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/5 border border-sky-500/10 font-bold">
                    {paper.category.replace("-", " ")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {paper.publishYear}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
                  {isRtl ? paper.titleFa : paper.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {isRtl ? paper.authorsFa : paper.authorsEn}
                </p>

                <p className="text-xs text-slate-500 font-mono italic">
                  {isRtl ? paper.journalFa : paper.journalEn}
                </p>

                {paper.doi && (
                  <div className="pt-1.5">
                    <span className="text-[11px] font-mono text-slate-600 block">
                      DOI: <span className="text-slate-400 select-all">{paper.doi}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Vector Panel */}
              <div className="flex sm:flex-col justify-end gap-2 w-full sm:w-auto flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-900/60">
                {paper.downloadUrl && (
                  <a
                    href={paper.downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors w-full sm:w-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {labels.downloadBtn}
                  </a>
                )}
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors w-full sm:w-auto shadow-md shadow-sky-500/5">
                  <FileText className="w-3.5 h-3.5" />
                  {isRtl ? "مشاهده مقاله" : "View Abstract"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPapers.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-950/10 text-slate-500 text-sm">
            {labels.emptyState}
          </div>
        )}
      </div>
    </div>
  );
}

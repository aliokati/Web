"use client";

import { useState } from "react";
import { Locale } from "@/i18n/config";
import { BoardMember, BoardLabels } from "@/types/board";
import { Search, UserCheck, GraduationCap, Award, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BoardGridProps {
  locale: Locale;
  members: BoardMember[];
  labels: BoardLabels;
}

export default function ResearchBoardGrid({ locale, members, labels }: BoardGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isRtl = locale === "fa";

  // Real-time keyword filter covering name, academic title, and clinical focus parameters
  const filteredMembers = members.filter((member) => {
    const normalizeQuery = searchQuery.toLowerCase();
    const stringMatrix = (
      member.nameEn + member.nameFa + 
      member.roleEn + member.roleFa + 
      member.focusAreaEn + member.focusAreaFa
    ).toLowerCase();
    return stringMatrix.includes(normalizeQuery);
  });

  return (
    <div className="w-full space-y-8">
      {/* Live Input Search Controller Component */}
      <div className="relative max-w-xl mx-auto">
        <Search className={`absolute top-3.5 w-5 h-5 text-slate-500 ${isRtl ? "right-4" : "left-4"}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className={`w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200 focus:border-sky-500/40 focus:outline-none placeholder:text-slate-600 transition-all ${
            isRtl ? "pr-12 pl-4" : "pl-12 pr-4"
          }`}
        />
      </div>

      {/* Structural Card Grid Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member) => (
            <motion.div
              layout
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-sky-500/20 transition-all sleep-glow overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Profile Layer */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                        {isRtl ? member.nameFa : member.nameEn}
                      </h3>
                      <UserCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    </div>
                    <p className="text-xs font-mono text-sky-400/90 font-semibold uppercase tracking-wide">
                      {isRtl ? member.roleFa : member.roleEn}
                    </p>
                  </div>
                </div>

                {/* Academic Affiliation Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-900/80 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GraduationCap className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="font-medium">{isRtl ? member.academicTitleFa : member.academicTitleEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Award className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span>{isRtl ? member.institutionFa : member.institutionEn}</span>
                  </div>
                </div>

                {/* Subspecialty Focus Matrix */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase block">
                    {labels.focusLabel}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isRtl ? member.focusAreaFa : member.focusAreaEn}
                  </p>
                </div>
              </div>

              {/* Verified ORCID Meta Anchor Link */}
              {member.orcid && (
                <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between w-full text-[11px] font-mono">
                  <span className="text-slate-600 uppercase tracking-wider">{labels.orcidLabel}</span>
                  <a
                    href={`https://orcid.org{member.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1 select-all"
                  >
                    {member.orcid}
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fallback Screen for Null Search Parameters */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
          {labels.noMembers}
        </div>
      )}
    </div>
  );
}

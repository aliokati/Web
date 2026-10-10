"use client";

import { useState } from "react";
import { Locale } from "@/i18n/config";
import { Practitioner } from "@/types/professionals";
import { Search, ShieldCheck, MapPin, Building2, UserPlus, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DirectoryProps {
  locale: Locale;
  practitioners: Practitioner[];
  labels: {
    searchPlaceholder: string;
    registryTitle: string;
    verifiedMember: string;
    noResults: string;
    joinNetwork: string;
    licenseLabel: string;
  };
}

export default function ProfessionalDirectory({ locale, practitioners, labels }: DirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isRtl = locale === "fa";

  // Filter items instantly by input across bilingual name and specialty values
  const filteredDirectory = practitioners.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (doc.nameEn + doc.nameFa).toLowerCase().includes(query);
    const specMatch = (doc.specialtyEn + doc.specialtyFa).toLowerCase().includes(query);
    return nameMatch || specMatch;
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Sidebar: Join Network Context Anchor */}
      <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 mb-4">
          <UserPlus className="h-5 w-5 text-sky-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{labels.joinNetwork}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {isRtl 
            ? "پزشکان، روان‌شناسان سلامت و پژوهشگران علوم اعصاب و خواب در خراسان می‌توانند جهت عضویت ثبت‌نام کنند."
            : "Physicians, health psychologists, and neuroscientists specializing in sleep can apply to join the regional registry."}
        </p>
        
        {/* Onboarding Trigger Button Link placeholder */}
        <button className="w-full py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-lg shadow-sky-500/5">
          {isRtl ? "ثبت درخواست عضویت متخصصین" : "Apply for Member Registry"}
        </button>
      </div>

      {/* Main Container: Interactive Live Query Directory */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dynamic Search Controller Box */}
        <div className="relative">
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

        {/* Directory Card Manifest Matrix */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDirectory.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-700/60"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-slate-100">
                      {isRtl ? doc.nameFa : doc.nameEn}
                    </h4>
                    {doc.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <ShieldCheck className="w-3 h-3" />
                        {labels.verifiedMember}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm font-medium text-sky-400/90 font-mono tracking-wide">
                    {isRtl ? doc.specialtyFa : doc.specialtyEn}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-600" />
                      {isRtl ? doc.affiliationFa : doc.affiliationEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      {isRtl ? doc.locationFa : doc.locationEn}
                    </span>
                  </div>
                </div>

                {/* Technical Registry Metadata Tag */}
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    {labels.licenseLabel}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    {doc.registryId}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty Query Verification Fallback */}
          {filteredDirectory.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 text-slate-500 text-sm">
              {labels.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { Locale } from "@/i18n/config";
import { ContactFormInput, ContactLabels } from "@/types/contact";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormProps {
  locale: Locale;
  labels: ContactLabels;
}

export default function ContactForm({ locale, labels }: FormProps) {
  const isRtl = locale === "fa";
  const [formData, setFormData] = useState<ContactFormInput>({
    senderName: "",
    senderEmail: "",
    affiliationType: "public",
    messageSubject: "",
    messageBody: ""
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate localized API processing pipeline latency
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setFormData({ senderName: "", senderEmail: "", affiliationType: "public", messageSubject: "", messageBody: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-xl">
      {status === "success" ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center py-12 space-y-4"
        >
          <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white">{labels.successMsg}</h3>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">{labels.nameLabel}</label>
              <input
                required
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200 focus:border-sky-500/40 focus:outline-none transition-all"
              />
            </div>

            {/* Sender Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">{labels.emailLabel}</label>
              <input
                required
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200 focus:border-sky-500/40 focus:outline-none transition-all dir-ltr"
              />
            </div>
          </div>

          {/* Affiliation Type Dropdown Tracker */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">{labels.typeLabel}</label>
            <select
              value={formData.affiliationType}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliationType: e.target.value as any }))}
              className={`w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-300 focus:border-sky-500/40 focus:outline-none transition-all appearance-none bg-[url('/images/select-arrow.svg')] bg-no-repeat ${
                isRtl ? "bg-[position:left_1rem_center]" : "bg-[position:right_1rem_center]"
              }`}
            >
              <option value="public" className="bg-[#090d16]">{labels.typePublic}</option>
              <option value="professional" className="bg-[#090d16]">{labels.typeProfessional}</option>
              <option value="researcher" className="bg-[#090d16]">{labels.typeResearcher}</option>
            </select>
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">{labels.subjectLabel}</label>
            <input
              required
              type="text"
              value={formData.messageSubject}
              onChange={(e) => setFormData(prev => ({ ...prev, messageSubject: e.target.value }))}
              className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200 focus:border-sky-500/40 focus:outline-none transition-all"
            />
          </div>

          {/* Message Body Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">{labels.bodyLabel}</label>
            <textarea
              required
              rows={5}
              value={formData.messageBody}
              onChange={(e) => setFormData(prev => ({ ...prev, messageBody: e.target.value }))}
              className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200 focus:border-sky-500/40 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Submit Trigger Action */}
          <button
            disabled={status === "submitting"}
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-sky-500/5"
          >
            <Send className="w-4 h-4" />
            {status === "submitting" ? "..." : labels.submitBtn}
          </button>

          {status === "error" && (
            <div className="p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>An execution error occurred. Please try again.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

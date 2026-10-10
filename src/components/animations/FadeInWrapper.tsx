"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  delay?: number;
}

export default function FadeInWrapper({ children, delay = 0 }: WrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

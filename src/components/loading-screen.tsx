"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rht-violet to-rht-violet-light shadow-[0_4px_20px_rgba(156,30,153,0.3)]"
      >
        <Shield className="h-8 w-8 text-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm font-medium text-muted-foreground"
      >
        <span className="font-normal opacity-60">Rostel</span>{" "}
        <span className="font-semibold">CyberSense</span>
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-rht-violet to-rht-orange"
      />
    </div>
  );
}

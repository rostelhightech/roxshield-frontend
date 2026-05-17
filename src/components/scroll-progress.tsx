"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    function onScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const current = window.scrollY / scrollHeight;
        setProgress(current);
        scaleX.set(current);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  // Only show if page is scrollable
  if (progress === 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-primary via-primary/80 to-primary"
      style={{ scaleX }}
    />
  );
}

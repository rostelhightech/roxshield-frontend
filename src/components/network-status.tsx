"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NetworkStatus() {
  const [online, setOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    function handleOffline() {
      setOnline(false);
    }

    function handleOnline() {
      setOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Set initial state
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-center gap-2 bg-destructive py-2 text-sm font-medium text-destructive-foreground"
        >
          <WifiOff className="h-4 w-4" />
          <span>Connexion perdue — vérifiez votre réseau</span>
        </motion.div>
      )}
      {showReconnected && online && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-center gap-2 bg-cyber-green py-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          <Wifi className="h-4 w-4" />
          <span>Connexion rétablie</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

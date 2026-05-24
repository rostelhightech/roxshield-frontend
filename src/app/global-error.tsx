"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#0a0a0f",
          color: "#f5f5f5",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #ef4444, #f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
          Erreur critique
        </h1>
        <p style={{ color: "#a1a1aa", marginTop: 12, maxWidth: 400 }}>
          Une erreur inattendue s&apos;est produite. Veuillez rafraichir la page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 32,
            padding: "10px 24px",
            borderRadius: 8,
            border: "1px solid #27272a",
            background: "transparent",
            color: "#f5f5f5",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Rafraichir la page
        </button>
        <p style={{ marginTop: 48, fontSize: 12, color: "#52525b" }}>
          RoxShield by Rostel High-Tech
        </p>
      </body>
    </html>
  );
}

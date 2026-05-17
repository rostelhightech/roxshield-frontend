import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Rostel CyberSense. Email, WhatsApp, formulaire — nous répondons sous 24 heures.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

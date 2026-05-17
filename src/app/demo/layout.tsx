import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander une démo",
  description:
    "Réservez une démo personnalisée de 30 minutes pour découvrir comment CyberSense réduit le risque humain dans votre organisation.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/encryption")({
  component: EncryptionPage,
});

function EncryptionPage() {
  return (
    <>
      <DashboardTopbar
        title="Chiffrement"
        description="Gestion du chiffrement des données"
      />
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5d2595]/20 border border-[#5d2595]/30">
          <Construction className="h-10 w-10 text-[#b27cff]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bientôt disponible</h2>
        <p className="text-gray-900 dark:text-white/50 max-w-md">
          Cette fonctionnalité est en cours de développement et sera disponible prochainement.
        </p>
      </div>
    </>
  );
}

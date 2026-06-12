'use client';

import { Link } from '@tanstack/react-router';
import { DashboardTopbar } from '@/components/layout/topbar';

export function CampaignNotFound() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <DashboardTopbar
        title="Campagne introuvable"
        description="Impossible de trouver cette campagne. Vérifiez l’identifiant et réessayez."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-gray-400">
        <p>Campagne non trouvée.</p>
        <Link
          className="mt-4 inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          to="/dashboard/campaigns"
        >
          Retour aux campagnes
        </Link>
      </div>
    </div>
  );
}
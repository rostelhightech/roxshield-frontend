import { useAuthStore } from "@/store/auth.store";
import { Bell, Search } from "lucide-react";

export function DashboardTopbar({title, description }: {title?: string, description?: string}) {
    const {user} = useAuthStore();
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">
          {title || `${user?.role || "Utilisateur"} — RoxShield`}
        </h1>

        <p className="text-zinc-400">
          {description || "Vue globale de la plateforme"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-600/50 px-2  py-.5">
          <Search size={15} />
          <input
            className="bg-transparent rounded-md  outline-none"
            placeholder="Rechercher..."
          />
        </div>

        <Bell width={20} height={20} />

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5d2595]">
          {user?.name ? user.name.charAt(0) + user.name.split(' ')[1]?.charAt(0) : 'AR'}
        </div>
      </div>
    </div>
  );
}
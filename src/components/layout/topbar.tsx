import { roleEnum } from "@/constants/roleEnum";
import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";
import { Bell, Search, Users, Mail, BookOpen, Building2, Users2, FileText, Sun, Moon, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/contexts/theme.context";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUserStore } from "@/store/user.store";
import { useCampaignStore } from "@/store/campaign.store";
import { useFormationStore } from "@/store/formation.store";
import { useGroupStore } from "@/store/group.store";

export function DashboardTopbar({ title, description }: { title?: string; description?: string }) {
  const { user } = useAuthStore();
  const { organizations } = useOrganizationStore();
  const { users } = useUserStore();
  const { campaigns } = useCampaignStore();
  const { formations } = useFormationStore();
  const { groups } = useGroupStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);

  const isNotSuperAdmin = user?.role !== roleEnum.SUPERADMIN;
  const orgName = isNotSuperAdmin ? organizations[0]?.name : null;

  const initials = user?.name
    ? user.name.charAt(0) + (user.name.split(" ")[1]?.charAt(0) ?? "")
    : "AR";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchItems = useMemo(() => {
    const items = [];

    if (user?.role === roleEnum.SUPERADMIN) {
      items.push(
        { type: "page", icon: Users, title: "Utilisateurs", url: "/dashboard/users" },
        { type: "page", icon: Mail, title: "Campagnes", url: "/dashboard/campaigns" },
        { type: "page", icon: BookOpen, title: "Formations", url: "/dashboard/formations" },
        { type: "page", icon: Building2, title: "Organisations", url: "/dashboard/organizations" },
        { type: "page", icon: Users2, title: "Groupes", url: "/dashboard/groups" },
        { type: "page", icon: FileText, title: "Templates", url: "/dashboard/templates" }
      );
    } else if (user?.role === roleEnum.ADMIN) {
      items.push(
        { type: "page", icon: Mail, title: "Campagnes", url: "/dashboard/campaigns" },
        { type: "page", icon: BookOpen, title: "Formations", url: "/dashboard/formations" },
        { type: "page", icon: Users, title: "Utilisateurs", url: "/dashboard/users" }
      );
    }

    if (user?.role !== roleEnum.USER) {
      users.slice(0, 10).forEach((u) => {
        items.push({
          type: "user", icon: Users,
          title: `${u.firstName} ${u.lastName}`,
          subtitle: u.email,
          url: `/dashboard/users`,
        });
      });
    }

    if (user?.role === roleEnum.SUPERADMIN || user?.role === roleEnum.ADMIN) {
      campaigns.slice(0, 10).forEach((c) => {
        items.push({
          type: "campaign", icon: Mail,
          title: c.name,
          subtitle: `Status: ${c.status}`,
          url: `/dashboard/campaigns`,
        });
      });
    }

    formations.slice(0, 10).forEach((f) => {
      items.push({
        type: "formation", icon: BookOpen,
        title: f.title,
        subtitle: f.description,
        url: `/dashboard/formations/${f.id}`,
      });
    });

    if (user?.role !== roleEnum.USER) {
      groups.slice(0, 10).forEach((g) => {
        items.push({
          type: "group", icon: Users2,
          title: g.name,
          subtitle: g.description || `${g.users?.length || 0} membres`,
          url: `/dashboard/groups`,
        });
      });
    }

    return items;
  }, [users, campaigns, formations, groups, user?.role]);

  return (
    <>
      <div className="flex rounded-md items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900">
        {/* Gauche — titre + description */}
        <div>
          <h1 className="text-md font-medium text-gray-900 dark:text-white leading-snug">
            {title || (isNotSuperAdmin && orgName ? orgName : "RoxShield")}
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5 leading-none">
            {description || "Vue globale de la plateforme"}
          </p>
        </div>

        {/* Droite — actions */}
        <div className="flex items-center gap-1.5">
          {/* Recherche */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 min-w-[200px] rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Search size={13} className="text-gray-400 dark:text-zinc-500 shrink-0" />
            <span className="text-md text-gray-400 dark:text-zinc-500 flex-1 text-left">Rechercher...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-[10px] text-gray-400 dark:text-zinc-500">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Séparateur */}
          <div className="w-px h-5 bg-gray-200 dark:bg-white/5 mx-1" />

          {/* Thème */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Mode clair" : "Mode sombre"}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5d2595] ring-2 ring-white dark:ring-[#0f0e13]" />
          </button>

          {/* Séparateur */}
          <div className="w-px h-5 bg-gray-200 dark:bg-white/5 mx-1" />

          {/* User pill */}
          <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5d2595] text-[10px] font-medium text-white shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-[12px] font-medium text-gray-900 dark:text-white">{user?.name ?? "Utilisateur"}</p>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">{orgName ?? user?.role}</p>
            </div>
            <ChevronDown size={12} className="text-gray-400 dark:text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Command palette */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg bg-white dark:bg-gray-900 rounded-sm">
          <Command className="bg-white dark:bg-gray-900">
            <CommandInput
              placeholder="Rechercher dans RoxShield..."
              className="border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
            />
            <CommandList className="bg-white dark:bg-gray-900">
              <CommandEmpty className="text-gray-400 dark:text-gray-500 text-sm py-6 text-center">
                Aucun résultat trouvé.
              </CommandEmpty>

              {(["page", "user", "campaign", "formation", "group"] as const).map((type) => {
                const filtered = searchItems.filter((item) => item.type === type);
                if (!filtered.length) return null;

                const labels: Record<string, string> = {
                  page: "Pages",
                  user: "Utilisateurs",
                  campaign: "Campagnes",
                  formation: "Formations",
                  group: "Groupes",
                };

                return (
                  <CommandGroup
                    key={type}
                    heading={labels[type]}
                    className="text-gray-400 dark:text-gray-500 text-xs"
                  >
                    {filtered.map((item, index) => (
                      <CommandItem
                        key={`${type}-${index}`}
                        onSelect={() => {
                          navigate({ to: item.url as any });
                          setOpen(false);
                        }}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <item.icon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm">{item.title}</span>
                          {item.subtitle && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
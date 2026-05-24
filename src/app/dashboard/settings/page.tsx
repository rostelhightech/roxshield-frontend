"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import {
  Building2,
  Users,
  Bell,
  Shield,
  Globe,
  Lock,
  CheckCircle,
  Plus,
  Clock,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import { COUNTRIES, SECTORS, SESSION_TIMEOUT_OPTIONS } from "@/lib/constants";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  organization: {
    id: string;
    name: string;
    plan: string;
    sector: string | null;
    country: string | null;
    city: string | null;
    size: number | null;
    sessionTimeoutMinutes: number;
  } | null;
}

interface EmployeesData {
  employees: any[];
  departments: string[];
}

const notifSettings = [
  { id: "email-report", label: "Rapport mensuel par email", description: "Recevez un résumé chaque fin de mois", enabled: true },
  { id: "phishing-alert", label: "Alerte taux de clic élevé", description: "Notification si le taux de clic dépasse 40%", enabled: true },
  { id: "training-reminder", label: "Rappels de formation", description: "Rappeler aux employés de compléter leurs modules", enabled: false },
  { id: "new-employee", label: "Nouvel employé ajouté", description: "Notification quand un employé rejoint la plateforme", enabled: true },
];

const countryOptions = COUNTRIES.map((c) => ({
  value: c.name,
  label: c.name,
  icon: c.flag,
  sub: c.dial,
}));

const sectorOptions = SECTORS.map((s) => ({
  value: s,
  label: s,
}));

const timeoutOptions = SESSION_TIMEOUT_OPTIONS.map((o) => ({
  value: String(o.value),
  label: o.label,
}));

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data: user, loading: loadingUser, refetch: refetchUser } = useApi<UserProfile>("/api/me");
  const { data: empData } = useApi<EmployeesData>("/api/employees");
  const [notifications, setNotifications] = useState(
    notifSettings.reduce((acc, n) => ({ ...acc, [n.id]: n.enabled }), {} as Record<string, boolean>)
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for org info
  const [orgForm, setOrgForm] = useState<{
    name: string; sector: string; country: string; city: string; size: string; contactEmail: string; sessionTimeoutMinutes: string;
  } | null>(null);

  // Initialize form when data loads
  if (user?.organization && !orgForm) {
    setOrgForm({
      name: user.organization.name || "",
      sector: user.organization.sector || "",
      country: user.organization.country || "",
      city: user.organization.city || "",
      size: String(user.organization.size || ""),
      contactEmail: user.email || "",
      sessionTimeoutMinutes: String(user.organization.sessionTimeoutMinutes ?? 15),
    });
  }

  const handleSaveOrg = async () => {
    if (!orgForm) return;
    setSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgForm.name,
          sector: orgForm.sector,
          country: orgForm.country,
          city: orgForm.city,
          size: orgForm.size ? Number(orgForm.size) : null,
          sessionTimeoutMinutes: Number(orgForm.sessionTimeoutMinutes),
        }),
      });
      if (res.ok) {
        setSaved(true);
        toast.success(t("common.saved"));
        await refetchUser();
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifs = () => {
    setSaved(true);
    toast.success(t("common.saved"));
    setTimeout(() => setSaved(false), 2000);
  };

  if (loadingUser) {
    return (
      <div>
        <Header title={t("settings.title")} />
        <div className="space-y-6 p-6">
          <Skeleton className="h-10 w-[400px]" />
          <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const org = user?.organization;
  const totalEmployees = empData?.employees.length || 0;

  // Admins from employee list
  const admins = (empData?.employees || []).filter((e: any) => e.role === "ADMIN" || e.role === "SUPER_ADMIN");

  const planLabel = org?.plan === "ENTERPRISE" ? "Enterprise" : org?.plan === "BUSINESS" ? "Business" : org?.plan === "CAMPUS" ? "Campus" : "Starter";
  const planLimit = org?.plan === "ENTERPRISE" ? "Illimité" : org?.plan === "BUSINESS" ? "200" : "50";

  return (
    <div>
      <Header title={t("settings.title")} />
      <div className="space-y-6 p-6">
        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organization">{t("settings.organization")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
            <TabsTrigger value="security">{t("settings.security")}</TabsTrigger>
            <TabsTrigger value="team">{t("settings.team")}</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-6">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-rht-violet-light" />
                    <CardTitle className="text-sm font-semibold">{t("settings.orgInfo")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("settings.orgName")}</Label>
                      <Input value={orgForm?.name || ""} onChange={(e) => setOrgForm((f) => f ? { ...f, name: e.target.value } : f)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.sector")}</Label>
                      <Combobox
                        options={sectorOptions}
                        value={orgForm?.sector || ""}
                        onChange={(v) => setOrgForm((f) => f ? { ...f, sector: v } : f)}
                        placeholder="Sélectionner un secteur..."
                        searchPlaceholder="Rechercher un secteur..."
                        allowCustom
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.country")}</Label>
                      <Combobox
                        options={countryOptions}
                        value={orgForm?.country || ""}
                        onChange={(v) => setOrgForm((f) => f ? { ...f, country: v } : f)}
                        placeholder="Sélectionner un pays..."
                        searchPlaceholder="Rechercher un pays..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.city")}</Label>
                      <Input value={orgForm?.city || ""} onChange={(e) => setOrgForm((f) => f ? { ...f, city: e.target.value } : f)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.employeeCount")}</Label>
                      <Input value={orgForm?.size || ""} type="number" onChange={(e) => setOrgForm((f) => f ? { ...f, size: e.target.value } : f)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.contactEmail")}</Label>
                      <Input value={orgForm?.contactEmail || ""} type="email" disabled className="opacity-60" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSaveOrg}
                        disabled={saving}
                        className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                      >
                        {saved ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {t("common.saved")}
                          </span>
                        ) : saving ? (
                          "Enregistrement..."
                        ) : (
                          t("common.save")
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-rht-violet-light" />
                    <CardTitle className="text-sm font-semibold">{t("settings.planSubscription")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Plan {planLabel}</h3>
                        <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">{t("common.active")}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("settings.upTo")} {planLimit} {t("common.employees")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">{t("common.manage")}</Button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: t("settings.usedEmployees"), value: `${totalEmployees}/${planLimit}` },
                      { label: t("settings.campaignsMonth"), value: "—" },
                      { label: t("settings.reportsStorage"), value: "—" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border p-3 text-center">
                        <p className="text-lg font-bold">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rht-orange" />
                    <CardTitle className="text-sm font-semibold">{t("settings.notifPreferences")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {notifSettings.map((notif, i) => (
                      <div key={notif.id}>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-medium">{notif.label}</p>
                            <p className="text-xs text-muted-foreground">{notif.description}</p>
                          </div>
                          <button
                            onClick={() =>
                              setNotifications((prev) => ({ ...prev, [notif.id]: !prev[notif.id] }))
                            }
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                              notifications[notif.id] ? "bg-rht-violet" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                notifications[notif.id] ? "translate-x-5" : ""
                              }`}
                            />
                          </button>
                        </div>
                        {i < notifSettings.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSaveNotifs}
                        className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                      >
                        {saved ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {t("common.saved")}
                          </span>
                        ) : (
                          t("common.save")
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-rht-orange" />
                    <CardTitle className="text-sm font-semibold">{t("settings.accountSecurity")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Session Timeout */}
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-rht-violet-light" />
                        <p className="text-sm font-medium">Expiration de session</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Déconnexion automatique après une période d&apos;inactivité
                      </p>
                    </div>
                    <Combobox
                      options={timeoutOptions}
                      value={orgForm?.sessionTimeoutMinutes || "15"}
                      onChange={(v) => {
                        setOrgForm((f) => f ? { ...f, sessionTimeoutMinutes: v } : f);
                        // Auto-save timeout
                        fetch("/api/organization", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ sessionTimeoutMinutes: Number(v) }),
                        }).then((r) => {
                          if (r.ok) toast.success("Timeout mis à jour");
                          else toast.error("Erreur");
                        });
                      }}
                      className="w-[160px]"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">{t("profile.2fa")}</p>
                      <p className="text-xs text-muted-foreground">{t("profile.2faDesc")}</p>
                    </div>
                    <Badge className="border-0 bg-rht-orange/10 text-rht-orange text-[10px]">{t("common.soon")}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">SSO (Single Sign-On)</p>
                      <p className="text-xs text-muted-foreground">Google Workspace / Microsoft 365</p>
                    </div>
                    <Badge variant="outline">{t("common.notConfigured")}</Badge>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-rht-violet-light" />
                      <CardTitle className="text-sm font-semibold">{t("settings.administrators")}</CardTitle>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                      <Plus className="mr-1 h-3 w-3" />
                      {t("settings.invite")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {admins.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">{t("settings.noAdmins")}</p>
                  ) : (
                    <div className="space-y-3">
                      {admins.map((admin: any) => (
                        <div
                          key={admin.email}
                          className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-accent"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rht-violet to-rht-violet-light text-sm font-medium text-white">
                              {(admin.name || admin.email).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{admin.name || admin.email}</p>
                              <p className="text-xs text-muted-foreground">{admin.email}</p>
                            </div>
                          </div>
                          <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">
                            {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">{t("settings.rolesPermissions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { role: "Admin", perms: t("settings.adminPerms"), count: admins.length },
                      { role: "Employé", perms: t("settings.employeePerms"), count: Math.max(0, totalEmployees - admins.length) },
                    ].map((r) => (
                      <div key={r.role} className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{r.role}</p>
                            <Badge variant="outline" className="text-[10px]">{r.count}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{r.perms}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Bell,
  Shield,
  Globe,
  Mail,
  Lock,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { currentUser, employees } from "@/lib/mock-data";
import { FadeIn } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";

const notifSettings = [
  { id: "email-report", label: "Rapport mensuel par email", description: "Recevez un résumé chaque fin de mois", enabled: true },
  { id: "phishing-alert", label: "Alerte taux de clic élevé", description: "Notification si le taux de clic dépasse 40%", enabled: true },
  { id: "training-reminder", label: "Rappels de formation", description: "Rappeler aux employés de compléter leurs modules", enabled: false },
  { id: "new-employee", label: "Nouvel employé ajouté", description: "Notification quand un employé rejoint la plateforme", enabled: true },
];

const admins = [
  { name: "Fatou Sow", email: "f.sow@safisenegal.com", role: "Admin principal" },
  { name: "Ibrahima Fall", email: "i.fall@safisenegal.com", role: "Admin IT" },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(
    notifSettings.reduce((acc, n) => ({ ...acc, [n.id]: n.enabled }), {} as Record<string, boolean>)
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Paramètres enregistrés");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Header title="Paramètres" />
      <div className="space-y-6 p-6">
        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="team">Équipe admin</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-6">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-rht-violet-light" />
                    <CardTitle className="text-sm font-semibold">Informations de l&apos;organisation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nom de l&apos;organisation</Label>
                      <Input defaultValue={currentUser.org} />
                    </div>
                    <div className="space-y-2">
                      <Label>Secteur d&apos;activité</Label>
                      <Input defaultValue="Services financiers" />
                    </div>
                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Input defaultValue="Sénégal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input defaultValue="Dakar" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre d&apos;employés</Label>
                      <Input defaultValue={employees.length.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email de contact</Label>
                      <Input defaultValue="contact@safisenegal.com" type="email" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                      >
                        {saved ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Sauvegardé
                          </span>
                        ) : (
                          "Enregistrer"
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
                    <CardTitle className="text-sm font-semibold">Plan & Abonnement</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Plan Business</h3>
                        <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">Actif</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Jusqu&apos;à 100 employés — Renouvellement le 15/06/2026
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Gérer
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Employés utilisés", value: `${employees.length}/100` },
                      { label: "Campagnes ce mois", value: "3/10" },
                      { label: "Stockage rapports", value: "12 MB / 1 GB" },
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
                    <CardTitle className="text-sm font-semibold">Préférences de notification</CardTitle>
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
                        onClick={handleSave}
                        className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                      >
                        {saved ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Sauvegardé
                          </span>
                        ) : (
                          "Enregistrer"
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
                    <Mail className="h-4 w-4 text-rht-violet-light" />
                    <CardTitle className="text-sm font-semibold">Destinataires des rapports</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["f.sow@safisenegal.com", "direction@safisenegal.com"].map((email) => (
                      <div key={email} className="flex items-center justify-between rounded-lg border px-3 py-2">
                        <span className="text-sm">{email}</span>
                        <button className="text-muted-foreground hover:text-cyber-red">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="mr-1 h-3 w-3" />
                    Ajouter un email
                  </Button>
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
                    <CardTitle className="text-sm font-semibold">Sécurité du compte</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">Authentification à deux facteurs (2FA)</p>
                      <p className="text-xs text-muted-foreground">Protégez votre compte avec un code supplémentaire</p>
                    </div>
                    <Badge className="border-0 bg-cyber-green/10 text-cyber-green">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">SSO (Single Sign-On)</p>
                      <p className="text-xs text-muted-foreground">Connexion via Google Workspace ou Microsoft 365</p>
                    </div>
                    <Badge variant="outline">Non configuré</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">Politique de mots de passe</p>
                      <p className="text-xs text-muted-foreground">Minimum 8 caractères, 1 majuscule, 1 chiffre</p>
                    </div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-sm font-medium">Sessions actives</p>
                      <p className="text-xs text-muted-foreground">2 sessions actives — Dernière connexion : Dakar, Sénégal</p>
                    </div>
                    <Button variant="outline" size="sm">Voir</Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-rht-violet-light" />
                    <CardTitle className="text-sm font-semibold">Journaux d&apos;audit</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { action: "Connexion", user: "Fatou Sow", date: "2026-05-12 09:14", ip: "196.168.1.42" },
                      { action: "Campagne lancée", user: "Fatou Sow", date: "2026-05-01 14:30", ip: "196.168.1.42" },
                      { action: "Rapport exporté", user: "Ibrahima Fall", date: "2026-04-30 16:20", ip: "196.168.1.55" },
                      { action: "Employé ajouté", user: "Fatou Sow", date: "2026-04-22 10:05", ip: "196.168.1.42" },
                      { action: "Paramètres modifiés", user: "Ibrahima Fall", date: "2026-04-15 11:45", ip: "196.168.1.55" },
                    ].map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground">{log.user}</span>
                        <span className="hidden text-xs text-muted-foreground sm:inline">{log.ip}</span>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </motion.div>
                    ))}
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
                      <CardTitle className="text-sm font-semibold">Administrateurs</CardTitle>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                      <Plus className="mr-1 h-3 w-3" />
                      Inviter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div
                        key={admin.email}
                        className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rht-violet to-rht-violet-light text-sm font-medium text-white">
                            {admin.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                        <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">{admin.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Rôles & Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { role: "Admin principal", perms: "Accès complet à toutes les fonctionnalités", count: 1 },
                      { role: "Admin IT", perms: "Gestion des employés, formations et paramètres", count: 1 },
                      { role: "Manager", perms: "Voir les rapports et statistiques de son département", count: 0 },
                      { role: "Employé", perms: "Accès aux formations et à son espace personnel", count: employees.length - 2 },
                    ].map((r) => (
                      <div key={r.role} className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{r.role}</p>
                            <Badge variant="outline" className="text-[10px]">{r.count}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{r.perms}</p>
                        </div>
                        <Button variant="ghost" size="sm">Modifier</Button>
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

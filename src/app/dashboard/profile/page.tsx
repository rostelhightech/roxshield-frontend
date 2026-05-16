"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Building2,
  Shield,
  Bell,
  Lock,
  Camera,
  CheckCircle,
  Globe,
  User,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCampaign, setNotifCampaign] = useState(true);
  const [notifReport, setNotifReport] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Profil mis à jour avec succès");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Header title="Mon profil" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-to-br from-rht-violet to-rht-violet-light text-xl text-white">
                      {currentUser.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-rht-violet text-white">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      {currentUser.role === "admin" ? "Administrateur" : "Utilisateur"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Building2 className="mr-1 h-3 w-3" />
                      {currentUser.org}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-rht-violet-light" />
                  <CardTitle className="text-sm font-semibold">Informations personnelles</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Prénom</Label>
                    <Input defaultValue="Fatou" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nom</Label>
                    <Input defaultValue="Sow" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Adresse email</Label>
                  <Input defaultValue={currentUser.email} type="email" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Téléphone</Label>
                  <Input defaultValue="+242 06 XXX XXXX" type="tel" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Poste</Label>
                    <Input defaultValue="Directrice des Systèmes d'Information" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Département</Label>
                    <Input defaultValue="IT / Sécurité" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Langue</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Français</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.15}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rht-orange" />
                    <CardTitle className="text-sm font-semibold">Préférences de notification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Alertes par email", desc: "Recevoir les alertes de sécurité par email", state: notifEmail, toggle: setNotifEmail },
                    { label: "Résultats de campagne", desc: "Notification après chaque simulation", state: notifCampaign, toggle: setNotifCampaign },
                    { label: "Rapports mensuels", desc: "Recevoir le rapport mensuel automatique", state: notifReport, toggle: setNotifReport },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.toggle(!item.state)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          item.state ? "bg-rht-violet" : "bg-muted"
                        }`}
                      >
                        <motion.div
                          animate={{ x: item.state ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyber-red" />
                    <CardTitle className="text-sm font-semibold">Sécurité</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Mot de passe actuel</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nouveau mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Confirmer</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-medium">Authentification 2FA</p>
                      <p className="text-xs text-muted-foreground">Sécurisez votre compte avec un second facteur</p>
                    </div>
                    <Badge className="border-0 bg-rht-orange/10 text-rht-orange text-[10px]">Bientôt</Badge>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={0.25}>
          <div className="flex justify-end gap-3">
            <Button variant="outline">Annuler</Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90"
              >
                {saved ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Enregistré !
                  </span>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

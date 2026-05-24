"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Building2,
  Shield,
  Lock,
  Camera,
  CheckCircle,
  Globe,
  User,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  department: string | null;
  position: string | null;
  role: string;
  locale: string;
  riskScore: number;
  organization: {
    id: string;
    name: string;
    plan: string;
  } | null;
}

function getInitials(name?: string | null, email?: string): string {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (email || "").slice(0, 2).toUpperCase();
}

export default function EmployeeProfilePage() {
  const { t } = useTranslation();
  const { data: user, loading, refetch } = useApi<UserProfile>("/api/me");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Sync form when data loads
  const [initialized, setInitialized] = useState(false);
  if (user && !initialized) {
    setName(user.name || "");
    setPhone(user.phone || "");
    setPosition(user.position || "");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, position }),
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        await refetch();
      } else {
        toast.error(t("common.error"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/me/avatar", { method: "POST", body: formData });
      if (res.ok) {
        toast.success("Photo mise à jour !");
        await refetch();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erreur lors de l'upload");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Mot de passe mis à jour !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || t("common.error"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading || !user) {
    return (
      <div>
        <Header title="Mon profil" />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Mon profil" />
      <div className="space-y-6 p-6">
        {/* Profile header */}
        <FadeIn>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
                    <AvatarFallback className="bg-gradient-to-br from-cyber-green/80 to-cyber-green text-xl text-white">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-cyber-green text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{user.name || user.email}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="border-0 bg-cyber-green/10 text-cyber-green text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      Employé
                    </Badge>
                    {user.organization && (
                      <Badge variant="outline" className="text-xs">
                        <Building2 className="mr-1 h-3 w-3" />
                        {user.organization.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal info */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyber-green" />
                  <CardTitle className="text-sm font-semibold">{t("profile.personalInfo")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.fullName")}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.email")}</Label>
                  <Input value={user.email} type="email" disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.phone")}</Label>
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.position")}</Label>
                  <Input value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                {user.department && (
                  <div className="space-y-2">
                    <Label className="text-xs">{t("profile.department")}</Label>
                    <Input value={user.department} disabled className="opacity-60" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.language")}</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.locale === "en" ? "English" : "Français"}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-cyber-green/80 to-cyber-green text-white hover:opacity-90"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 animate-spin" />
                          {t("common.saving")}
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

          {/* Security */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyber-red" />
                  <CardTitle className="text-sm font-semibold">{t("profile.security")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.currentPassword")}</Label>
                  <Input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.newPassword")}</Label>
                  <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.confirmPassword")}</Label>
                  <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {savingPassword ? t("common.saving") : t("profile.changePassword")}
                </Button>
                <Separator />
                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">{t("profile.2fa")}</p>
                    <p className="text-xs text-muted-foreground">{t("profile.2faDesc")}</p>
                  </div>
                  <Badge className="border-0 bg-rht-orange/10 text-rht-orange text-[10px]">{t("common.soon")}</Badge>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

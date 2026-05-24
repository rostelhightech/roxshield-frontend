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
  Bell,
  Lock,
  Camera,
  CheckCircle,
  Globe,
  User,
} from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";
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

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: user, loading, refetch } = useApi<UserProfile>("/api/me");
  const [saving, setSaving] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCampaign, setNotifCampaign] = useState(true);
  const [notifReport, setNotifReport] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");

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
    setDepartment(user.department || "");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, position, department }),
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

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.selectImage"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("profile.imageTooLarge"));
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/me/avatar", { method: "POST", body: formData });
      if (res.ok) {
        toast.success(t("profile.photoUpdated"));
        await refetch();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || t("profile.uploadError"));
      }
    } catch {
      toast.error(t("profile.networkError"));
    } finally {
      setUploadingPhoto(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error(t("profile.fillAllFields"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("profile.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("profile.passwordMismatch"));
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
        toast.success(t("profile.passwordUpdated"));
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
        <Header title={t("profile.title")} />
        <div className="space-y-6 p-6">
          <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel = user.role === "SUPER_ADMIN" ? t("common.role.superAdmin") : user.role === "ADMIN" ? t("common.role.admin") : t("common.role.employee");

  return (
    <div>
      <Header title={t("profile.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
                    <AvatarFallback className="bg-gradient-to-br from-rht-violet to-rht-violet-light text-xl text-white">
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
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-rht-violet text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{user.name || user.email}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      {roleLabel}
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
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-rht-violet-light" />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">{t("profile.position")}</Label>
                    <Input value={position} onChange={(e) => setPosition(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t("profile.department")}</Label>
                    <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("profile.language")}</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={user.locale}
                      onChange={async (e) => {
                        const newLocale = e.target.value;
                        await fetch("/api/me", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ locale: newLocale }),
                        });
                        toast.success(newLocale === "en" ? "Language updated" : "Langue mise à jour");
                        await refetch();
                        window.location.reload();
                      }}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
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
                    <CardTitle className="text-sm font-semibold">{t("profile.notificationPrefs")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: t("profile.alertEmail"), desc: t("profile.alertEmailDesc"), state: notifEmail, toggle: setNotifEmail },
                    { label: t("profile.campaignResults"), desc: t("profile.campaignResultsDesc"), state: notifCampaign, toggle: setNotifCampaign },
                    { label: t("profile.monthlyReports"), desc: t("profile.monthlyReportsDesc"), state: notifReport, toggle: setNotifReport },
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
                    <PasswordStrength password={newPassword} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t("profile.confirmPassword")}</Label>
                    <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-[10px] text-red-500">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
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

        <FadeIn delay={0.25}>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (user) {
                  setName(user.name || "");
                  setPhone(user.phone || "");
                  setPosition(user.position || "");
                  setDepartment(user.department || "");
                }
              }}
            >
              {t("common.cancel")}
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white hover:opacity-90"
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
        </FadeIn>
      </div>
    </div>
  );
}

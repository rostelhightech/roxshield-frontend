"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Building2,
  Users,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  Rocket,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: "org", label: "Organisation", icon: Building2 },
  { id: "team", label: "Équipe", icon: Users },
  { id: "campaign", label: "Campagne", icon: Target },
  { id: "done", label: "Terminé", icon: Rocket },
];

const templates = [
  { id: "urgent-transfer", label: "Virement urgent", desc: "Email du PDG demandant un virement en urgence", type: "Email", templateType: "bank" },
  { id: "password-reset", label: "Réinitialisation mot de passe", desc: "Faux email de réinitialisation de mot de passe", type: "Email", templateType: "internal" },
  { id: "mobile-money", label: "Vérification Mobile Money", desc: "SMS de vérification de compte Mobile Money", type: "SMS", templateType: "mobile_money" },
  { id: "invoice", label: "Facture fournisseur", desc: "Fausse facture avec lien de paiement", type: "Email", templateType: "delivery" },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgCountry, setOrgCountry] = useState("");
  const [orgSector, setOrgSector] = useState("");
  const [members, setMembers] = useState([
    { name: "", email: "", department: "" },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [addedMembers, setAddedMembers] = useState(0);
  const [campaignCreated, setCampaignCreated] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const addMember = () => {
    setMembers([...members, { name: "", email: "", department: "" }]);
  };

  const removeMember = (i: number) => {
    setMembers(members.filter((_, idx) => idx !== i));
  };

  const updateMember = (i: number, field: string, value: string) => {
    const updated = [...members];
    updated[i] = { ...updated[i], [field]: value };
    setMembers(updated);
  };

  const saveOrganization = async () => {
    if (!orgName.trim()) {
      toast.error("Le nom de l'organisation est requis");
      return false;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, country: orgCountry, sector: orgSector }),
      });
      if (!res.ok) {
        toast.error("Erreur lors de la sauvegarde");
        return false;
      }
      toast.success("Organisation mise à jour");
      return true;
    } catch {
      toast.error("Erreur réseau");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveMembers = async () => {
    const validMembers = members.filter((m) => m.email.trim());
    if (validMembers.length === 0) return true; // skip if no members

    setSaving(true);
    let count = 0;
    try {
      for (const member of validMembers) {
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
        if (res.ok) count++;
      }
      setAddedMembers(count);
      if (count > 0) toast.success(`${count} membre(s) ajouté(s)`);
      return true;
    } catch {
      toast.error("Erreur réseau");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveCampaign = async () => {
    if (!selectedTemplate) return true; // skip if none selected

    const tpl = templates.find((t) => t.id === selectedTemplate);
    if (!tpl) return true;

    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tpl.label,
          templateType: tpl.templateType,
          targetDepts: [],
        }),
      });
      if (res.ok) {
        setCampaignCreated(true);
        toast.success("Campagne créée en brouillon");
      }
      return res.ok;
    } catch {
      toast.error("Erreur réseau");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      const ok = await saveOrganization();
      if (!ok) return;
    } else if (step === 1) {
      const ok = await saveMembers();
      if (!ok) return;
    } else if (step === 2) {
      const ok = await saveCampaign();
      if (!ok) return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rht-violet to-rht-violet-light">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Configurez votre espace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quelques étapes pour démarrer avec RoxShield
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between gap-2">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isDone = i < step;
              const isCurrent = i === step;
              return (
                <div key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      isDone
                        ? "border-cyber-green bg-cyber-green text-white"
                        : isCurrent
                        ? "border-rht-violet bg-rht-violet/10 text-rht-violet-light"
                        : "border-muted bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="mt-4 h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Card>
                <CardContent className="space-y-5 p-6">
                  <div className="text-center">
                    <Building2 className="mx-auto mb-2 h-8 w-8 text-rht-violet-light" />
                    <h2 className="text-lg font-bold">Votre organisation</h2>
                    <p className="text-sm text-muted-foreground">Renseignez les informations de base</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Nom de l&apos;organisation *</Label>
                      <Input
                        placeholder="Ex: Safi Sénégal SARL"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Pays</Label>
                        <Input
                          placeholder="Ex: Sénégal"
                          value={orgCountry}
                          onChange={(e) => setOrgCountry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Secteur d&apos;activité</Label>
                        <Input
                          placeholder="Ex: Services financiers"
                          value={orgSector}
                          onChange={(e) => setOrgSector(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card>
                <CardContent className="space-y-5 p-6">
                  <div className="text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-rht-violet-light" />
                    <h2 className="text-lg font-bold">Ajoutez votre équipe</h2>
                    <p className="text-sm text-muted-foreground">Invitez vos collaborateurs — ils recevront un email d&apos;invitation</p>
                  </div>

                  <div className="space-y-3">
                    {members.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <div className="grid flex-1 gap-2 sm:grid-cols-3">
                          <Input
                            placeholder="Nom complet"
                            value={m.name}
                            onChange={(e) => updateMember(i, "name", e.target.value)}
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={m.email}
                            onChange={(e) => updateMember(i, "email", e.target.value)}
                          />
                          <Input
                            placeholder="Département"
                            value={m.department}
                            onChange={(e) => updateMember(i, "department", e.target.value)}
                          />
                        </div>
                        {members.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mt-0.5 h-9 w-9 shrink-0 text-muted-foreground hover:text-cyber-red"
                            onClick={() => removeMember(i)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={addMember}>
                      <Plus className="mr-1 h-3 w-3" />
                      Ajouter
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Upload className="mr-1 h-3 w-3" />
                      Importer CSV (bientôt)
                    </Button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    {members.filter((m) => m.email).length} membre(s) à inviter — vous pourrez en ajouter d&apos;autres plus tard
                  </p>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="space-y-5 p-6">
                  <div className="text-center">
                    <Target className="mx-auto mb-2 h-8 w-8 text-rht-violet-light" />
                    <h2 className="text-lg font-bold">Première simulation</h2>
                    <p className="text-sm text-muted-foreground">Choisissez un template pour votre première campagne de phishing</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {templates.map((t) => (
                      <motion.button
                        key={t.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          selectedTemplate === t.id
                            ? "border-rht-violet/40 bg-rht-violet/5"
                            : "hover:border-muted-foreground/20 hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{t.label}</p>
                          <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                        {selectedTemplate === t.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2"
                          >
                            <CheckCircle className="h-4 w-4 text-rht-violet-light" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    La campagne sera créée en brouillon — vous pourrez la personnaliser avant de l&apos;envoyer
                  </p>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-green/80 to-cyber-green">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    <h2 className="text-lg font-bold">Configuration terminée !</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Votre espace RoxShield est prêt à utiliser
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Building2, label: "Organisation", value: orgName || "Non renseigné", color: "text-rht-violet-light", bg: "bg-rht-violet/10" },
                      { icon: Users, label: "Membres", value: `${addedMembers} invité(s)`, color: "text-rht-orange", bg: "bg-rht-orange/10" },
                      { icon: Target, label: "Campagne", value: campaignCreated ? templates.find((t) => t.id === selectedTemplate)?.label ?? "—" : "Aucune", color: "text-cyber-green", bg: "bg-cyber-green/10" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-xl border p-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={saving}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
              Passer
            </Button>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleNext}
              disabled={saving}
              className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enregistrement...
                </span>
              ) : step === steps.length - 1 ? (
                <>
                  Accéder au dashboard
                  <Rocket className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

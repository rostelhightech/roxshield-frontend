"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Crosshair,
  Send,
  MousePointerClick,
  Flag,
  AlertTriangle,
  Play,
  Users,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FadeIn, StaggerContainer, StaggerItem, GlowCard } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  templateType: string;
  status: string;
  totalTargets: number;
  sentCount: number;
  clickCount: number;
  reportCount: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface CampaignsResponse {
  campaigns: Campaign[];
  stats: {
    totalCampaigns: number;
    totalSent: number;
    clickRate: number;
    reportRate: number;
  };
}

const templateOptions = [
  { id: "rh-paie", label: "Faux bulletin de paie", type: "Email phishing", description: "Un email imitant les RH demandant de verifier un bulletin de paie" },
  { id: "pdg-virement", label: "Virement urgent du PDG", type: "Spear-phishing", description: "Usurpation d'identite du PDG demandant un virement immediat" },
  { id: "facture-fournisseur", label: "Facture fournisseur", type: "Email phishing", description: "Fausse facture avec un lien vers un portail de paiement frauduleux" },
  { id: "momo-verification", label: "Verification Mobile Money", type: "Smishing", description: "SMS simulant une verification de compte Mobile Money" },
];

export default function SimulationsPage() {
  const { t } = useTranslation();
  const { data, loading, refetch } = useApi<CampaignsResponse>("/api/campaigns");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const campaigns = data?.campaigns || [];
  const stats = data?.stats || { totalCampaigns: 0, totalSent: 0, clickRate: 0, reportRate: 0 };

  const chartData = campaigns.map((c) => ({
    name: c.name.length > 25 ? c.name.slice(0, 25) + "…" : c.name,
    Clique: c.clickCount,
    Signale: c.reportCount,
    Ignore: Math.max(0, c.sentCount - c.clickCount - c.reportCount),
  }));

  const handleLaunch = async () => {
    if (!selectedTemplate) return;
    setLaunching(true);
    try {
      const tpl = templateOptions.find((t) => t.id === selectedTemplate);
      // Step 1: Create campaign in DRAFT
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tpl?.label || "Nouvelle campagne",
          templateType: tpl?.id || "email_phishing",
          description: tpl?.description,
        }),
      });
      if (res.ok) {
        const campaign = await res.json();
        // Step 2: Launch campaign (send emails)
        const launchRes = await fetch(`/api/campaigns/${campaign.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "launch" }),
        });
        if (launchRes.ok) {
          const result = await launchRes.json();
          setLaunched(true);
          toast.success(`Campagne lancee — ${result.sentCount} emails envoyes`);
        } else {
          const err = await launchRes.json();
          toast.error(err.error || "Erreur lors du lancement");
        }
        await refetch();
        setTimeout(() => {
          setCreateOpen(false);
          setLaunched(false);
          setSelectedTemplate(null);
        }, 2500);
      }
    } catch {
      toast.error("Erreur reseau");
    } finally {
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title={t("simulations.title")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={t("simulations.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("simulations.description")}
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="bg-gradient-to-r from-rht-orange to-rht-orange-light text-white glow-orange-sm hover:opacity-90"
                onClick={() => setCreateOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                {t("simulations.newCampaign")}
              </Button>
            </motion.div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-4">
          {[
            { icon: Crosshair, value: stats.totalCampaigns, label: t("simulations.activeCampaigns"), bg: "bg-rht-violet/10", text: "text-rht-violet" },
            { icon: Send, value: stats.totalSent, label: t("simulations.totalSent"), bg: "bg-rht-violet-light/10", text: "text-rht-violet-light" },
            { icon: MousePointerClick, value: stats.clickRate + "%", label: t("simulations.clickRate"), bg: "bg-cyber-red/10", text: "text-cyber-red" },
            { icon: Flag, value: stats.reportRate + "%", label: t("simulations.reportRate"), bg: "bg-cyber-green/10", text: "text-cyber-green" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <GlowCard>
                <Card className="transition-all duration-300 hover:border-rht-violet/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`h-5 w-5 ${s.text}`} />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {chartData.length > 0 && (
          <FadeIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{t("simulations.resultsByCampaign")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Legend formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>} />
                      <Bar dataKey="Clique" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Signale" fill="#25d366" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Ignore" fill="#fa990e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{t("simulations.campaignHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="py-12 text-center">
                  <Send className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{t("simulations.noCampaigns")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((cam, i) => {
                    const clickRate = cam.sentCount > 0 ? Math.round((cam.clickCount / cam.sentCount) * 100) : 0;
                    const reportRate = cam.sentCount > 0 ? Math.round((cam.reportCount / cam.sentCount) * 100) : 0;
                    return (
                      <motion.div
                        key={cam.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="cursor-pointer rounded-xl border p-4 transition-colors hover:bg-accent"
                        onClick={() => setDetailCampaign(cam)}
                      >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold">{cam.name}</h3>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-[10px]">{cam.templateType}</Badge>
                              <Badge variant="outline" className={`text-[10px] ${cam.status === "ACTIVE" ? "border-cyber-green text-cyber-green" : cam.status === "COMPLETED" ? "border-rht-violet text-rht-violet" : ""}`}>
                                {cam.status}
                              </Badge>
                              <span>{cam.totalTargets} cibles</span>
                            </div>
                          </div>
                          {clickRate > 40 && (
                            <Badge className="w-fit border-0 bg-cyber-red/10 text-cyber-red">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {t("simulations.highClickRate")}
                            </Badge>
                          )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-muted-foreground">{t("simulations.clicked")}</p>
                            <p className="text-lg font-bold text-cyber-red">{clickRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t("simulations.reported")}</p>
                            <p className="text-lg font-bold text-cyber-green">{reportRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t("simulations.sent")}</p>
                            <p className="text-lg font-bold text-muted-foreground">{cam.sentCount}</p>
                          </div>
                        </div>
                        <Progress value={clickRate} className="mt-3 h-2" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Dialog : Nouvelle campagne */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("simulations.launchNewCampaign")}</DialogTitle>
            <DialogDescription>{t("simulations.chooseTemplate")}</DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {launched ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyber-green/10">
                  <CheckCircle2 className="h-7 w-7 text-cyber-green" />
                </div>
                <p className="font-semibold">{t("simulations.campaignLaunched")}</p>
                <p className="text-xs text-muted-foreground">{t("simulations.emailsSending")}</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-3">
                {templateOptions.map((tpl) => (
                  <div
                    key={tpl.id}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      selectedTemplate === tpl.id
                        ? "border-rht-violet bg-rht-violet/5 ring-1 ring-rht-violet/20"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedTemplate(tpl.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{tpl.label}</p>
                      <Badge variant="outline" className="text-[10px]">{tpl.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{tpl.description}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!launched && (
            <DialogFooter>
              <Button
                className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                disabled={!selectedTemplate || launching}
                onClick={handleLaunch}
              >
                {launching ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    {t("simulations.sending")}
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {t("simulations.launch")}
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog : Details d'une campagne */}
      <Dialog open={!!detailCampaign} onOpenChange={(open) => !open && setDetailCampaign(null)}>
        {detailCampaign && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{detailCampaign.name}</DialogTitle>
              <DialogDescription>{detailCampaign.templateType} - {detailCampaign.totalTargets} cibles</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{detailCampaign.status}</Badge>
                <span className="text-xs text-muted-foreground">{detailCampaign.totalTargets} cibles</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <MousePointerClick className="h-4 w-4 text-cyber-red" />
                    <span className="text-xs text-muted-foreground">{t("simulations.clicked")}</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-cyber-red">{detailCampaign.clickCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {detailCampaign.sentCount > 0 ? Math.round((detailCampaign.clickCount / detailCampaign.sentCount) * 100) : 0}%
                  </p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Flag className="h-4 w-4 text-cyber-green" />
                    <span className="text-xs text-muted-foreground">{t("simulations.reported")}</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-cyber-green">{detailCampaign.reportCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {detailCampaign.sentCount > 0 ? Math.round((detailCampaign.reportCount / detailCampaign.sentCount) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-accent/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">{t("simulations.recommendation")}</p>
                <p className="mt-1 text-sm">
                  {detailCampaign.sentCount > 0 && Math.round((detailCampaign.clickCount / detailCampaign.sentCount) * 100) > 40
                    ? t("simulations.recHighClick")
                    : detailCampaign.sentCount > 0 && Math.round((detailCampaign.clickCount / detailCampaign.sentCount) * 100) > 25
                    ? t("simulations.recMediumClick")
                    : t("simulations.recLowClick")}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

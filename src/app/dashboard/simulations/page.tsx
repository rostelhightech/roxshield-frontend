"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
import { simulationResults } from "@/lib/mock-data";
import type { SimulationResult } from "@/lib/mock-data";
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

const chartData = simulationResults.map((sim) => ({
  name: sim.campaign.length > 25 ? sim.campaign.slice(0, 25) + "…" : sim.campaign,
  Cliqué: sim.clicked,
  Signalé: sim.reported,
  Ignoré: sim.ignored,
}));

const templateOptions = [
  { id: "rh-paie", label: "Faux bulletin de paie", type: "Email phishing", description: "Un email imitant les RH demandant de vérifier un bulletin de paie" },
  { id: "pdg-virement", label: "Virement urgent du PDG", type: "Spear-phishing", description: "Usurpation d'identité du PDG demandant un virement immédiat" },
  { id: "facture-fournisseur", label: "Facture fournisseur", type: "Email phishing", description: "Fausse facture avec un lien vers un portail de paiement frauduleux" },
  { id: "momo-verification", label: "Vérification Mobile Money", type: "Smishing", description: "SMS simulant une vérification de compte Mobile Money" },
];

export default function SimulationsPage() {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [detailSim, setDetailSim] = useState<SimulationResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const totalSent = simulationResults.reduce((a, s) => a + s.totalTargets, 0);
  const totalClicked = simulationResults.reduce((a, s) => a + s.clicked, 0);
  const totalReported = simulationResults.reduce((a, s) => a + s.reported, 0);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setLaunched(true);
      setTimeout(() => {
        setCreateOpen(false);
        setLaunched(false);
        setSelectedTemplate(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div>
      <Header title={t("simulations.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Testez la vigilance de vos équipes avec des campagnes de phishing simulées
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
            { icon: Crosshair, value: simulationResults.length, label: t("simulations.activeCampaigns"), bg: "bg-rht-violet/10", text: "text-rht-violet" },
            { icon: Send, value: totalSent, label: t("simulations.totalSent"), bg: "bg-rht-violet-light/10", text: "text-rht-violet-light" },
            { icon: MousePointerClick, value: Math.round((totalClicked / totalSent) * 100) + "%", label: t("simulations.clickRate"), bg: "bg-cyber-red/10", text: "text-cyber-red" },
            { icon: Flag, value: Math.round((totalReported / totalSent) * 100) + "%", label: t("simulations.reportRate"), bg: "bg-cyber-green/10", text: "text-cyber-green" },
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

        <FadeIn>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Résultats par campagne</CardTitle>
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
                    <Bar dataKey="Cliqué" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Signalé" fill="#25d366" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Ignoré" fill="#fa990e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Historique des campagnes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulationResults.map((sim, i) => {
                  const clickRate = Math.round((sim.clicked / sim.totalTargets) * 100);
                  const reportRate = Math.round((sim.reported / sim.totalTargets) * 100);
                  return (
                    <motion.div
                      key={sim.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="cursor-pointer rounded-xl border p-4 transition-colors hover:bg-accent"
                      onClick={() => setDetailSim(sim)}
                    >
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold">{sim.campaign}</h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px]">
                              {sim.type}
                            </Badge>
                            <span>{sim.sentDate}</span>
                            <span>{sim.totalTargets} cibles</span>
                          </div>
                        </div>
                        {clickRate > 40 && (
                          <Badge className="w-fit border-0 bg-cyber-red/10 text-cyber-red">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Taux de clic élevé
                          </Badge>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Ouvert</p>
                          <p className="text-lg font-bold">
                            {Math.round((sim.opened / sim.totalTargets) * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cliqué</p>
                          <p className="text-lg font-bold text-cyber-red">{clickRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Signalé</p>
                          <p className="text-lg font-bold text-cyber-green">{reportRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ignoré</p>
                          <p className="text-lg font-bold text-muted-foreground">
                            {Math.round((sim.ignored / sim.totalTargets) * 100)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={clickRate} className="mt-3 h-2" />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Dialog : Nouvelle campagne */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lancer une nouvelle campagne</DialogTitle>
            <DialogDescription>
              Choisissez un template de simulation de phishing à envoyer à vos employés.
            </DialogDescription>
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
                <p className="font-semibold">Campagne lancée !</p>
                <p className="text-xs text-muted-foreground">Les emails seront envoyés dans les prochaines minutes.</p>
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

                <div className="rounded-xl border border-dashed p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>Cibles : <strong className="text-foreground">Tous les employés (10)</strong></span>
                  </div>
                </div>
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
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Lancer la campagne
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog : Détails d'une campagne */}
      <Dialog open={!!detailSim} onOpenChange={(open) => !open && setDetailSim(null)}>
        {detailSim && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{detailSim.campaign}</DialogTitle>
              <DialogDescription>
                Détails de la campagne envoyée le {detailSim.sentDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{detailSim.type}</Badge>
                <span className="text-xs text-muted-foreground">{detailSim.totalTargets} cibles</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Ouvert</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">{detailSim.opened}/{detailSim.totalTargets}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((detailSim.opened / detailSim.totalTargets) * 100)}%</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <MousePointerClick className="h-4 w-4 text-cyber-red" />
                    <span className="text-xs text-muted-foreground">Cliqué</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-cyber-red">{detailSim.clicked}/{detailSim.totalTargets}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((detailSim.clicked / detailSim.totalTargets) * 100)}%</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Flag className="h-4 w-4 text-cyber-green" />
                    <span className="text-xs text-muted-foreground">Signalé</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-cyber-green">{detailSim.reported}/{detailSim.totalTargets}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((detailSim.reported / detailSim.totalTargets) * 100)}%</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Ignoré</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">{detailSim.ignored}/{detailSim.totalTargets}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((detailSim.ignored / detailSim.totalTargets) * 100)}%</p>
                </div>
              </div>

              <div className="rounded-xl bg-accent/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Recommandation</p>
                <p className="mt-1 text-sm">
                  {Math.round((detailSim.clicked / detailSim.totalTargets) * 100) > 40
                    ? "Taux de clic critique. Planifiez une formation ciblée pour les collaborateurs ayant cliqué sur le lien."
                    : Math.round((detailSim.clicked / detailSim.totalTargets) * 100) > 25
                    ? "Vigilance moyenne. Un rappel de bonnes pratiques serait bénéfique pour l'équipe."
                    : "Bons résultats ! Continuez à renforcer la sensibilisation avec des campagnes régulières."}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

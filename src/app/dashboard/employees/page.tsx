"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  UserPlus,
  Download,
  Upload,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Shield,
  GraduationCap,
  Target,
  Mail,
  Building2,
  Briefcase,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string | null;
  email: string;
  department: string | null;
  position: string | null;
  role: string;
  riskScore: number;
  trainingsCompleted: number;
}

interface EmployeesResponse {
  employees: Employee[];
  departments: string[];
}

function getStatus(riskScore: number): "safe" | "moderate" | "at-risk" {
  if (riskScore <= 30) return "safe";
  if (riskScore <= 60) return "moderate";
  return "at-risk";
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

function StatusBadge({ status, t }: { status: string; t: (key: any) => string }) {
  switch (status) {
    case "safe":
      return <Badge className="border-0 bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20">{t("employees.safe")}</Badge>;
    case "moderate":
      return <Badge className="border-0 bg-rht-orange/10 text-rht-orange hover:bg-rht-orange/20">{t("employees.moderate")}</Badge>;
    case "at-risk":
      return <Badge className="border-0 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20">{t("employees.atRisk")}</Badge>;
  }
}

type SortKey = "name" | "department" | "riskScore" | "trainingsCompleted";
type SortDir = "asc" | "desc";

export default function EmployeesPage() {
  const { t, locale } = useTranslation();
  const { data, loading, refetch } = useApi<EmployeesResponse>("/api/employees");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", department: "", position: "" });
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Employee | null>(null);
  const [trainingModules, setTrainingModules] = useState<{ id: string; title: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [assigning, setAssigning] = useState(false);

  const handleAddEmployee = async () => {
    if (!addForm.email) { toast.error("L'email est requis"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(
          data.emailSent
            ? (locale === "en" ? "Employee added — invitation sent by email" : "Employé ajouté — invitation envoyée par email")
            : (locale === "en" ? "Employee added successfully" : "Employé ajouté avec succès")
        );
        setShowAddDialog(false);
        setAddForm({ name: "", email: "", department: "", position: "" });
        await refetch();
      } else {
        const err = await res.json();
        toast.error(err.error || t("common.error"));
      }
    } catch { toast.error(t("profile.networkError")); }
    finally { setAdding(false); }
  };

  const handleDeleteEmployee = async (emp: Employee) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/employees?id=${emp.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(locale === "en" ? "Employee deleted" : "Employé supprimé");
        setSelectedEmployee(null);
        await refetch();
      } else {
        const err = await res.json();
        toast.error(err.error || t("common.error"));
      }
    } catch { toast.error(t("profile.networkError")); }
    finally { setDeleting(false); }
  };

  const handleExportCSV = () => {
    const headers = locale === "en"
      ? ["Name", "Email", "Department", "Position", "Role", "Risk score", "Trainings"]
      : ["Nom", "Email", "Département", "Poste", "Rôle", "Score de risque", "Formations"];
    const rows = (data?.employees || []).map((e) => [
      e.name || "", e.email, e.department || "", e.position || "", e.role, String(e.riskScore), String(e.trainingsCompleted),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roxshield-employes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(locale === "en" ? "CSV export downloaded" : "Export CSV téléchargé");
  };

  const handleImportCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.txt";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setImporting(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/employees/import", { method: "POST", body: formData });
        const result = await res.json();
        if (res.ok) {
          toast.success(locale === "en"
            ? `Import done: ${result.created} created, ${result.skipped} skipped`
            : `Import terminé : ${result.created} créé(s), ${result.skipped} ignoré(s)`);
          if (result.errors?.length > 0) {
            toast.info(result.errors.slice(0, 3).join(", ") + (result.errors.length > 3 ? "..." : ""));
          }
          await refetch();
        } else {
          toast.error(result.error || t("common.error"));
        }
      } catch {
        toast.error(t("profile.networkError"));
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  const openAssignTraining = async (emp: Employee) => {
    setAssignTarget(emp);
    setShowAssignDialog(true);
    try {
      const res = await fetch("/api/training");
      if (res.ok) {
        const d = await res.json();
        setTrainingModules(d.modules?.map((m: any) => ({ id: m.id, title: m.title })) || []);
      }
    } catch { /* ignore */ }
  };

  const handleAssignTraining = async (moduleId: string) => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      const res = await fetch("/api/training/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: assignTarget.id, moduleId }),
      });
      if (res.ok) {
        toast.success(locale === "en"
          ? `Training assigned to ${assignTarget.name || assignTarget.email}`
          : `Formation assignée à ${assignTarget.name || assignTarget.email}`);
        setShowAssignDialog(false);
        setAssignTarget(null);
      } else {
        const err = await res.json();
        toast.error(err.error || t("common.error"));
      }
    } catch { toast.error(t("profile.networkError")); }
    finally { setAssigning(false); }
  };

  const openIncludeCampaign = async (emp: Employee) => {
    setAssignTarget(emp);
    setShowCampaignDialog(true);
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const d = await res.json();
        setCampaigns(d.campaigns?.map((c: any) => ({ id: c.id, name: c.name })) || []);
      }
    } catch { /* ignore */ }
  };

  const handleIncludeCampaign = async (campaignId: string) => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      const res = await fetch("/api/campaigns/include", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: assignTarget.id, campaignId }),
      });
      if (res.ok) {
        toast.success(locale === "en"
          ? `${assignTarget.name || assignTarget.email} included in campaign`
          : `${assignTarget.name || assignTarget.email} inclus dans la campagne`);
        setShowCampaignDialog(false);
        setAssignTarget(null);
      } else {
        const err = await res.json();
        toast.error(err.error || t("common.error"));
      }
    } catch { toast.error(t("profile.networkError")); }
    finally { setAssigning(false); }
  };

  const employees = data?.employees || [];
  const departments = data?.departments || [];

  const statuses = [
    { value: "all", label: t("common.all") },
    { value: "safe", label: t("employees.safe") },
    { value: "moderate", label: t("employees.moderate") },
    { value: "at-risk", label: t("employees.atRisk") },
  ];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    const result = employees.filter((e) => {
      const matchSearch =
        !search ||
        (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.department || "").toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      const status = getStatus(e.riskScore);
      const matchStatus = statusFilter === "all" || status === statusFilter;
      const matchDept = deptFilter === "all" || e.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });

    return [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return dir * (a.name || "").localeCompare(b.name || "");
      if (sortKey === "department") return dir * (a.department || "").localeCompare(b.department || "");
      if (sortKey === "trainingsCompleted") return dir * (a.trainingsCompleted - b.trainingsCompleted);
      return dir * (a.riskScore - b.riskScore);
    });
  }, [employees, search, statusFilter, deptFilter, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3" />
    );
  };

  if (loading) {
    return (
      <div>
        <Header title={t("employees.title")} />
        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
          <Card><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  const safeCount = employees.filter((e) => getStatus(e.riskScore) === "safe").length;
  const moderateCount = employees.filter((e) => getStatus(e.riskScore) === "moderate").length;
  const atRiskCount = employees.filter((e) => getStatus(e.riskScore) === "at-risk").length;

  return (
    <div>
      <Header title={t("employees.title")} />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("employees.search")}
                className="h-10 w-full pl-9 sm:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <select
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="all">{t("common.allDepartments")}</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="h-10" onClick={handleImportCSV} disabled={importing}>
                <Upload className="mr-2 h-4 w-4" />
                {importing ? "Import..." : "Importer CSV"}
              </Button>
              <Button variant="outline" size="sm" className="h-10" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                {t("common.export")}
              </Button>
              <Button size="sm" className="h-10 bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90" onClick={() => setShowAddDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                {t("common.add")}
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-3 sm:grid-cols-3">
          {[
            { color: "bg-cyber-green", count: safeCount, label: t("employees.safe"), filterValue: "safe", active: statusFilter === "safe" },
            { color: "bg-rht-orange", count: moderateCount, label: t("employees.moderate"), filterValue: "moderate", active: statusFilter === "moderate" },
            { color: "bg-cyber-red", count: atRiskCount, label: t("employees.atRisk"), filterValue: "at-risk", active: statusFilter === "at-risk" },
          ].map((s) => (
            <StaggerItem key={s.filterValue}>
              <Card
                className={`cursor-pointer transition-all duration-200 ${s.active ? "ring-2 ring-rht-violet/30" : "hover:border-rht-violet/20"}`}
                onClick={() => setStatusFilter(s.active ? "all" : s.filterValue)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`h-3 w-3 rounded-full ${s.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{s.count}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {filtered.length === employees.length
                  ? `${t("employees.allEmployees")} (${filtered.length})`
                  : `${filtered.length} ${t("common.results")} / ${employees.length}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("name")}>
                        {t("employees.name")} <SortIcon column="name" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("department")}>
                        {t("employees.department")} <SortIcon column="department" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("riskScore")}>
                        {t("employees.riskScore")} <SortIcon column="riskScore" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("trainingsCompleted")}>
                        {t("employees.trainings")} <SortIcon column="trainingsCompleted" />
                      </th>
                      <th className="pb-3 pr-4">{t("employees.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((emp) => (
                        <motion.tr
                          key={emp.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="cursor-pointer border-b last:border-0 transition-colors hover:bg-accent"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-rht-violet/10 text-[10px] text-rht-violet-light">
                                  {getInitials(emp.name, emp.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{emp.name || emp.email}</p>
                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">{emp.department || "—"}</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Progress value={emp.riskScore} className="h-2 w-16" />
                              <span
                                className={`text-sm font-semibold ${
                                  emp.riskScore <= 30
                                    ? "text-cyber-green"
                                    : emp.riskScore <= 60
                                    ? "text-rht-orange"
                                    : "text-cyber-red"
                                }`}
                              >
                                {emp.riskScore}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">{emp.trainingsCompleted}</td>
                          <td className="py-3 pr-4"><StatusBadge status={getStatus(emp.riskScore)} t={t} /></td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">{t("employees.noResults")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Dialog profil employe */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        {selectedEmployee && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-rht-violet to-rht-violet-light text-sm text-white">
                    {getInitials(selectedEmployee.name, selectedEmployee.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>{selectedEmployee.name || selectedEmployee.email}</span>
                  <p className="text-xs font-normal text-muted-foreground">{selectedEmployee.position || selectedEmployee.role}</p>
                </div>
              </DialogTitle>
              <DialogDescription>{t("employees.profileDesc")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedEmployee.department || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{selectedEmployee.position || selectedEmployee.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <Shield className={`mx-auto h-5 w-5 ${
                    selectedEmployee.riskScore <= 30 ? "text-cyber-green" : selectedEmployee.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red"
                  }`} />
                  <p className={`mt-1 text-xl font-bold ${
                    selectedEmployee.riskScore <= 30 ? "text-cyber-green" : selectedEmployee.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red"
                  }`}>{selectedEmployee.riskScore}%</p>
                  <p className="text-[10px] text-muted-foreground">{t("employees.riskScore")}</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <GraduationCap className="mx-auto h-5 w-5 text-rht-violet-light" />
                  <p className="mt-1 text-xl font-bold">{selectedEmployee.trainingsCompleted}</p>
                  <p className="text-[10px] text-muted-foreground">{t("employees.trainings")}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {getStatus(selectedEmployee.riskScore) !== "safe" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                    onClick={() => openAssignTraining(selectedEmployee)}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {t("employees.assignTraining")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openIncludeCampaign(selectedEmployee)}
                >
                  <Target className="mr-2 h-4 w-4" />
                  {t("employees.includeCampaign")}
                </Button>
              </div>
              {selectedEmployee.role === "EMPLOYEE" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  disabled={deleting}
                  onClick={() => handleDeleteEmployee(selectedEmployee)}
                >
                  {deleting ? "Suppression..." : "Supprimer cet employé"}
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Dialog ajout employe */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-rht-violet-light" />
              Ajouter un employé
            </DialogTitle>
            <DialogDescription>Renseignez les informations du nouvel employé</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input
                placeholder="Amadou Diallo"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="amadou@entreprise.sn"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Département</Label>
                <Input
                  placeholder="Finance"
                  value={addForm.department}
                  onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  placeholder="Comptable"
                  value={addForm.position}
                  onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                onClick={handleAddEmployee}
                disabled={adding}
              >
                {adding ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Assigner une formation */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Assigner une formation</DialogTitle>
            <DialogDescription>
              Choisissez un module pour {assignTarget?.name || assignTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {trainingModules.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucun module disponible</p>
            ) : (
              trainingModules.map((m) => (
                <button
                  key={m.id}
                  className="w-full text-left rounded-lg border p-3 hover:bg-accent/50 transition-colors disabled:opacity-50"
                  disabled={assigning}
                  onClick={() => handleAssignTraining(m.id)}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-rht-violet-light shrink-0" />
                    <span className="text-sm font-medium">{m.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Inclure dans une campagne */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Inclure dans une campagne</DialogTitle>
            <DialogDescription>
              Choisissez une campagne pour {assignTarget?.name || assignTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucune campagne disponible.{" "}
                <a href="/dashboard/simulations" className="text-rht-violet-light underline">
                  Créer une campagne
                </a>
              </p>
            ) : (
              campaigns.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left rounded-lg border p-3 hover:bg-accent/50 transition-colors disabled:opacity-50"
                  disabled={assigning}
                  onClick={() => handleIncludeCampaign(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-rht-orange shrink-0" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

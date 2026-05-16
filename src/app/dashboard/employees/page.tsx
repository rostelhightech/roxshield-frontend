"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Shield,
  GraduationCap,
  Target,
  Clock,
  Mail,
  Building2,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { employees } from "@/lib/mock-data";
import type { Employee } from "@/lib/mock-data";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";

function statusBadge(status: string) {
  switch (status) {
    case "safe":
      return <Badge className="border-0 bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20">Sûr</Badge>;
    case "moderate":
      return <Badge className="border-0 bg-rht-orange/10 text-rht-orange hover:bg-rht-orange/20">Modéré</Badge>;
    case "at-risk":
      return <Badge className="border-0 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20">À risque</Badge>;
  }
}

type SortKey = "name" | "department" | "riskScore" | "trainingsCompleted" | "lastActive";
type SortDir = "asc" | "desc";

const departments = [...new Set(employees.map((e) => e.department))].sort();
const statuses = [
  { value: "all", label: "Tous" },
  { value: "safe", label: "Sûr" },
  { value: "moderate", label: "Modéré" },
  { value: "at-risk", label: "À risque" },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    let result = employees.filter(
      (e) =>
        (e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" || e.status === statusFilter) &&
        (deptFilter === "all" || e.department === deptFilter)
    );

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return dir * a.name.localeCompare(b.name);
      if (sortKey === "department") return dir * a.department.localeCompare(b.department);
      if (sortKey === "lastActive") return dir * a.lastActive.localeCompare(b.lastActive);
      if (sortKey === "trainingsCompleted") return dir * (a.trainingsCompleted - b.trainingsCompleted);
      return dir * (a.riskScore - b.riskScore);
    });

    return result;
  }, [search, statusFilter, deptFilter, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3" />
    );
  };

  return (
    <div>
      <Header title="Employés" />
      <div className="space-y-6 p-6">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un employé..."
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
                <option value="all">Tous les départements</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="h-10">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" className="h-10 bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                <UserPlus className="mr-2 h-4 w-4" />
                Inviter
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-3 sm:grid-cols-3">
          {[
            { color: "bg-cyber-green", count: employees.filter((e) => e.status === "safe").length, label: "Zone sûre", active: statusFilter === "safe" },
            { color: "bg-rht-orange", count: employees.filter((e) => e.status === "moderate").length, label: "Risque modéré", active: statusFilter === "moderate" },
            { color: "bg-cyber-red", count: employees.filter((e) => e.status === "at-risk").length, label: "À risque", active: statusFilter === "at-risk" },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <Card
                className={`cursor-pointer transition-all duration-200 ${s.active ? "ring-2 ring-rht-violet/30" : "hover:border-rht-violet/20"}`}
                onClick={() => setStatusFilter(s.active ? "all" : s.label === "Zone sûre" ? "safe" : s.label === "Risque modéré" ? "moderate" : "at-risk")}
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
                  ? `Tous les employés (${filtered.length})`
                  : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""} sur ${employees.length}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("name")}>
                        Employé <SortIcon column="name" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("department")}>
                        Département <SortIcon column="department" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("riskScore")}>
                        Score de risque <SortIcon column="riskScore" />
                      </th>
                      <th className="cursor-pointer pb-3 pr-4 select-none" onClick={() => handleSort("trainingsCompleted")}>
                        Formations <SortIcon column="trainingsCompleted" />
                      </th>
                      <th className="pb-3 pr-4">Statut</th>
                      <th className="cursor-pointer pb-3 select-none" onClick={() => handleSort("lastActive")}>
                        Dernière activité <SortIcon column="lastActive" />
                      </th>
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
                                  {emp.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{emp.name}</p>
                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm">{emp.department}</td>
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
                          <td className="py-3 pr-4 text-sm">
                            {emp.trainingsCompleted}/{emp.totalTrainings}
                          </td>
                          <td className="py-3 pr-4">{statusBadge(emp.status)}</td>
                          <td className="py-3 text-sm text-muted-foreground">{emp.lastActive}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Aucun employé ne correspond à votre recherche</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Dialog profil employé */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        {selectedEmployee && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-rht-violet to-rht-violet-light text-sm text-white">
                    {selectedEmployee.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>{selectedEmployee.name}</span>
                  <p className="text-xs font-normal text-muted-foreground">{selectedEmployee.role}</p>
                </div>
              </DialogTitle>
              <DialogDescription>Profil détaillé et statistiques de sécurité</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedEmployee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{selectedEmployee.role}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Actif le {selectedEmployee.lastActive}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <Shield className={`mx-auto h-5 w-5 ${
                    selectedEmployee.riskScore <= 30 ? "text-cyber-green" : selectedEmployee.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red"
                  }`} />
                  <p className={`mt-1 text-xl font-bold ${
                    selectedEmployee.riskScore <= 30 ? "text-cyber-green" : selectedEmployee.riskScore <= 60 ? "text-rht-orange" : "text-cyber-red"
                  }`}>{selectedEmployee.riskScore}%</p>
                  <p className="text-[10px] text-muted-foreground">Score de risque</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <GraduationCap className="mx-auto h-5 w-5 text-rht-violet-light" />
                  <p className="mt-1 text-xl font-bold">{selectedEmployee.trainingsCompleted}/{selectedEmployee.totalTrainings}</p>
                  <p className="text-[10px] text-muted-foreground">Formations</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <Target className="mx-auto h-5 w-5 text-rht-orange" />
                  <p className="mt-1 text-xl font-bold">{Math.round((selectedEmployee.trainingsCompleted / selectedEmployee.totalTrainings) * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">Complétion</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Progression des formations</p>
                <Progress value={(selectedEmployee.trainingsCompleted / selectedEmployee.totalTrainings) * 100} className="h-3" />
              </div>

              <div className="rounded-xl bg-accent/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Recommandation</p>
                <p className="mt-1 text-sm">
                  {selectedEmployee.status === "at-risk"
                    ? "Employé à haut risque. Assignez des formations prioritaires et planifiez un entretien de sensibilisation."
                    : selectedEmployee.status === "moderate"
                    ? "Risque modéré. Encouragez la complétion des modules restants et surveillez les résultats des prochaines simulations."
                    : "Bon niveau de sécurité. Maintenez l'engagement avec des formations avancées et des défis réguliers."}
                </p>
              </div>

              <div className="flex gap-2">
                {selectedEmployee.status !== "safe" && (
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Assigner une formation
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex-1">
                  <Target className="mr-2 h-4 w-4" />
                  Inclure dans campagne
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

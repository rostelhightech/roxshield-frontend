"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PulseDot } from "@/components/pulse-dot";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  Mail,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type ActivityType = "phishing_detected" | "training_completed" | "badge_earned" | "risk_alert" | "user_joined" | "simulation_sent";

interface ActivityMeta {
  id: number;
  type: ActivityType;
  user: string;
  descKey: string;
  timeKey: string;
}

const iconMap = {
  phishing_detected: { icon: AlertTriangle, color: "text-rht-orange", bg: "bg-rht-orange/10" },
  training_completed: { icon: GraduationCap, color: "text-cyber-green", bg: "bg-cyber-green/10" },
  badge_earned: { icon: Shield, color: "text-rht-violet", bg: "bg-rht-violet/10" },
  risk_alert: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  user_joined: { icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  simulation_sent: { icon: Mail, color: "text-rht-violet-light", bg: "bg-rht-violet/10" },
};

const activitiesMeta: ActivityMeta[] = [
  { id: 1, type: "phishing_detected", user: "Fatou Sow", descKey: "activity.reportedSuspicious", timeKey: "activity.ago2min" },
  { id: 2, type: "training_completed", user: "Amadou Diallo", descKey: "activity.completedModule", timeKey: "activity.ago8min" },
  { id: 3, type: "badge_earned", user: "Marie Ndiaye", descKey: "activity.badgeEarned", timeKey: "activity.ago15min" },
  { id: 4, type: "simulation_sent", user: "Système", descKey: "activity.campaignLaunched", timeKey: "activity.ago25min" },
  { id: 5, type: "risk_alert", user: "Ibrahima Ba", descKey: "activity.riskAbove70", timeKey: "activity.ago32min" },
  { id: 6, type: "training_completed", user: "Aïssatou Fall", descKey: "activity.completedPasswords", timeKey: "activity.ago45min" },
  { id: 7, type: "user_joined", user: "Ousmane Gueye", descKey: "activity.joinedPlatform", timeKey: "activity.ago1h" },
  { id: 8, type: "phishing_detected", user: "Khady Diop", descKey: "activity.reportedSMS", timeKey: "activity.ago1h30" },
];

type DK = Parameters<ReturnType<typeof useTranslation>["t"]>[0];

export function ActivityFeed() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <PulseDot color="green" size="md" />
            {t("activity.title")}
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {t("activity.live")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activitiesMeta.map((activity, i) => {
            const config = iconMap[activity.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/50"
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> — {t(activity.descKey as DK)}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t(activity.timeKey as DK)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { GlowCard } from "@/components/motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  trendPositive?: boolean; // Whether the trend direction is good (green) or bad (red)
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection,
  trendPositive = true,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  return (
    <GlowCard>
      <Card className={cn("transition-all duration-300 hover:border-primary/20", className)}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              {trendDirection === "down" ? (
                <TrendingDown className={cn("h-3 w-3", trendPositive ? "text-cyber-green" : "text-destructive")} />
              ) : (
                <TrendingUp className={cn("h-3 w-3", trendPositive ? "text-cyber-green" : "text-destructive")} />
              )}
              <span>{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </GlowCard>
  );
}

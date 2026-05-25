"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, Eye, EyeOff, Lock, Mail, Crown, Building2, UserCircle, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 12000);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    const connectionDist = 150;
    const mouseDist = 200;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dxM = mouse.x - p.x;
        const dyM = mouse.y - p.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouseDist) {
          const force = (mouseDist - distM) / mouseDist;
          p.vx += (dxM / distM) * force * 0.02;
          p.vy += (dyM / distM) * force * 0.02;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(156, 30, 153, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const dxM = mouse.x - particles[i].x;
        const dyM = mouse.y - particles[i].y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouseDist) {
          const alpha = (1 - distM / mouseDist) * 0.4;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = `rgba(196, 40, 192, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      for (const p of particles) {
        const dxM = mouse.x - p.x;
        const dyM = mouse.y - p.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        const glow = distM < mouseDist ? 1 + (1 - distM / mouseDist) * 2 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 40, 192, ${p.opacity * glow * 0.8})`;
        ctx.fill();
      }

      // Mouse cursor glow
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        gradient.addColorStop(0, "rgba(156, 30, 153, 0.08)");
        gradient.addColorStop(1, "rgba(156, 30, 153, 0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

function HexagonIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
      <motion.path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        stroke="url(#hexGrad)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 15 L82 33 L82 67 L50 85 L18 67 L18 33 Z"
        stroke="url(#hexGrad)"
        strokeWidth="0.5"
        fill="rgba(156,30,153,0.05)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9c1e99" />
          <stop offset="100%" stopColor="#c428c0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const demoRoles = [
  {
    id: "super-admin", label: "Super Admin", sub: "Rostel High-Tech", icon: Crown, route: "/admin",
    email: "admin@rostelhightech.com", password: "admin2024!",
    active: "border-rht-orange/40 bg-rht-orange/10",
    iconActive: "bg-rht-orange/20", iconColor: "text-rht-orange",
    radio: "border-rht-orange bg-rht-orange",
  },
  {
    id: "admin-client", label: "Admin Client", sub: "Safi Sénégal SARL", icon: Building2, route: "/dashboard",
    email: "f.sow@safisenegal.com", password: "demo1234",
    active: "border-rht-violet-light/40 bg-rht-violet-light/10",
    iconActive: "bg-rht-violet-light/20", iconColor: "text-rht-violet-light",
    radio: "border-rht-violet-light bg-rht-violet-light",
  },
  {
    id: "employee", label: "Employé", sub: "Mon espace", icon: UserCircle, route: "/employee",
    email: "a.diallo@safisenegal.com", password: "demo1234",
    active: "border-cyber-green/40 bg-cyber-green/10",
    iconActive: "bg-cyber-green/20", iconColor: "text-cyber-green",
    radio: "border-cyber-green bg-cyber-green",
  },
];

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleLabels: Record<string, { label: string; sub: string }> = {
    "super-admin": { label: t("login.superAdmin"), sub: "Rostel High-Tech" },
    "admin-client": { label: t("login.adminClient"), sub: "Safi Sénégal SARL" },
    "employee": { label: t("login.employee"), sub: t("login.mySpace") },
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeoutMessage, setTimeoutMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("reason") === "timeout") {
      setTimeoutMessage(t("login.sessionExpired"));
    }
  }, [searchParams]);
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch { /* ignore */ }
    finally { setForgotLoading(false); }
  };

  const selectRole = (roleId: string) => {
    setSelectedRole(roleId);
    const role = demoRoles.find((r) => r.id === roleId);
    if (role) {
      setEmail(role.email);
      setPassword(role.password);
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const role = demoRoles.find((r) => r.id === selectedRole);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        result.error.includes("Trop de tentatives")
          ? t("login.tooManyAttempts")
          : t("login.invalidCredentials")
      );
      setIsLoading(false);
      return;
    }

    router.push(role?.route || "/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0810] p-4">
      {/* Glowing orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rht-violet/20 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rht-orange/15 blur-[120px]"
        />
      </div>

      {/* Interactive particle network */}
      <ParticleNetwork />

      {/* Scan line */}
      <motion.div
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-0 right-0 z-[1] h-px bg-gradient-to-r from-transparent via-rht-violet-light/20 to-transparent"
      />

      {/* Back to home */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
      >
        <Shield className="h-4 w-4" />
        <span><span className="font-normal opacity-60">Rox</span>Shield</span>
      </motion.a>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-rht-violet/20 via-transparent to-rht-orange/10 blur-xl" />

        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-4 h-16 w-16"
            >
              <HexagonIcon />
              <Shield className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-rht-violet-light" />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight text-white">{t("login.welcomeBack")}</h1>
            <p className="mt-1 text-sm text-white/40">{t("login.accessSpace")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-white/50">{t("login.emailLabel")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-11 border-white/[0.08] bg-white/[0.04] pl-10 text-white placeholder:text-white/20 focus:border-rht-violet/40 focus:ring-rht-violet/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-white/50">{t("login.passwordLabel")}</Label>
                <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotSent(false); }} className="text-[11px] text-rht-violet-light/70 hover:text-rht-violet-light">{t("login.forgotPassword")}</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-11 border-white/[0.08] bg-white/[0.04] pl-10 pr-10 text-white placeholder:text-white/20 focus:border-rht-violet/40 focus:ring-rht-violet/20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {timeoutMessage && !error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-rht-orange/20 bg-rht-orange/10 px-3 py-2 text-sm text-rht-orange"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {timeoutMessage}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-rht-violet to-rht-violet-light font-semibold text-white hover:opacity-90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("login.connecting")}
                  </span>
                ) : (
                  t("login.signIn")
                )}
              </Button>
            </motion.div>
          </form>

          {/* Forgot password overlay */}
          <AnimatePresence>
            {showForgot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-[#0a0810]/95 backdrop-blur-sm p-8"
              >
                <div className="w-full space-y-4">
                  <button
                    onClick={() => setShowForgot(false)}
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    {t("login.back")}
                  </button>

                  {forgotSent ? (
                    <div className="text-center space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyber-green/20">
                        <CheckCircle className="h-6 w-6 text-cyber-green" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{t("login.emailSent")}</h3>
                      <p className="text-xs text-white/50">
                        {t("login.emailSentDesc")} <span className="text-white/70">{forgotEmail}</span>, {t("login.emailSentDesc2")}
                      </p>
                      <Button
                        onClick={() => setShowForgot(false)}
                        variant="outline"
                        size="sm"
                        className="mt-2 border-white/10 text-white/60 hover:text-white"
                      >
                        {t("login.backToLogin")}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-white">{t("login.forgotTitle")}</h3>
                        <p className="mt-1 text-xs text-white/40">
                          {t("login.forgotDesc")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                          <Input
                            type="email"
                            placeholder={t("login.emailPlaceholder")}
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="h-11 border-white/[0.08] bg-white/[0.04] pl-10 text-white placeholder:text-white/20"
                            onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                          />
                        </div>
                        <Button
                          onClick={handleForgotPassword}
                          disabled={forgotLoading || !forgotEmail.trim()}
                          className="h-10 w-full bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                        >
                          {forgotLoading ? t("login.sending") : t("login.reset")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] uppercase tracking-widest text-white/20">{t("login.demoAccess")}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="space-y-2">
            {demoRoles.map((role) => {
              const isActive = selectedRole === role.id;
              const Icon = role.icon;
              return (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectRole(role.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                    isActive
                      ? role.active
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive ? role.iconActive : "bg-white/[0.04]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? role.iconColor : "text-white/30"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isActive ? "text-white" : "text-white/50"}`}>
                      {roleLabels[role.id]?.label ?? role.label}
                    </p>
                    <p className={`text-[11px] ${isActive ? "text-white/40" : "text-white/20"}`}>
                      {roleLabels[role.id]?.sub ?? role.sub}
                    </p>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border-2 transition-all ${
                      isActive
                        ? role.radio
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-full w-full items-center justify-center"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="mt-5 text-center text-[11px] text-white/25">
            {t("login.notClient")}{" "}
            <a href="/pricing" className="font-medium text-rht-violet-light/70 hover:text-rht-violet-light">
              {t("login.viewPricing")} &rarr;
            </a>
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 z-10 text-[10px] text-white/15"
      >
        Rostel High-Tech — www.rostelhightech.com
      </motion.p>
    </div>
  );
}

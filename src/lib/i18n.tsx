"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "fr" | "en";

const dictionaries = {
  fr: {
    // Common
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.search": "Rechercher",
    "common.export": "Exporter",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.add": "Ajouter",
    "common.close": "Fermer",
    "common.loading": "Chargement...",
    "common.saved": "Enregistré !",
    "common.yes": "Oui",
    "common.no": "Non",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.employees": "Employés",
    "nav.simulations": "Simulations",
    "nav.training": "Formations",
    "nav.reports": "Rapports & Analytics",
    "nav.settings": "Paramètres",
    "nav.profile": "Mon profil",
    "nav.setup": "Configuration",
    "nav.mySpace": "Mon espace",
    "nav.results": "Mes résultats",
    "nav.badges": "Badges",
    "nav.leaderboard": "Classement",
    "nav.logout": "Se déconnecter",
    "nav.about": "À propos",
    "nav.home": "Accueil",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.riskScore": "Score de risque moyen",
    "dashboard.atRiskEmployees": "Employés à risque",
    "dashboard.trainingsCompleted": "Formations complétées",
    "dashboard.totalEmployees": "Total employés",
    "dashboard.riskEvolution": "Évolution du risque humain",
    "dashboard.riskByDept": "Risque par département",
    "dashboard.highRiskEmployees": "Employés à risque élevé",
    "dashboard.thisMonth": "ce mois",
    "dashboard.outOf": "sur",
    "dashboard.employees": "employés",
    "dashboard.safeZone": "en zone sûre",

    // Employees
    "employees.title": "Employés",
    "employees.search": "Rechercher un employé...",
    "employees.name": "Nom",
    "employees.department": "Département",
    "employees.role": "Rôle",
    "employees.riskScore": "Score de risque",
    "employees.trainings": "Formations",
    "employees.status": "Statut",
    "employees.safe": "Sûr",
    "employees.moderate": "Modéré",
    "employees.atRisk": "À risque",

    // Simulations
    "simulations.title": "Simulations de phishing",
    "simulations.newCampaign": "Nouvelle campagne",
    "simulations.activeCampaigns": "Campagnes actives",
    "simulations.totalSent": "Emails envoyés",
    "simulations.clickRate": "Taux de clic",
    "simulations.reportRate": "Taux de signalement",

    // Training
    "training.title": "Modules de formation",
    "training.start": "Commencer",
    "training.continue": "Continuer",
    "training.completed": "Terminé",
    "training.duration": "Durée",
    "training.minutes": "min",

    // Reports
    "reports.title": "Rapports & Analytics",
    "reports.exportCSV": "Export CSV",
    "reports.exportPDF": "Exporter PDF",
    "reports.overview": "Vue d'ensemble",
    "reports.departments": "Départements",
    "reports.history": "Historique",
    "reports.riskEvolution": "Évolution du risque",
    "reports.phishingTrend": "Tendance phishing",
    "reports.statusDistribution": "Répartition des statuts",

    // Settings
    "settings.title": "Paramètres",
    "settings.organization": "Organisation",
    "settings.notifications": "Notifications",
    "settings.security": "Sécurité",
    "settings.team": "Équipe admin",
    "settings.orgInfo": "Informations de l'organisation",
    "settings.plan": "Plan & Abonnement",

    // Profile
    "profile.title": "Mon profil",
    "profile.personalInfo": "Informations personnelles",
    "profile.firstName": "Prénom",
    "profile.lastName": "Nom",
    "profile.email": "Adresse email",
    "profile.phone": "Téléphone",
    "profile.position": "Poste",
    "profile.department": "Département",
    "profile.language": "Langue",
    "profile.notificationPrefs": "Préférences de notification",
    "profile.security": "Sécurité",
    "profile.currentPassword": "Mot de passe actuel",
    "profile.newPassword": "Nouveau mot de passe",
    "profile.confirmPassword": "Confirmer",
    "profile.2fa": "Authentification 2FA",

    // Employee space
    "employee.welcome": "Bienvenue",
    "employee.yourRiskScore": "Votre score de risque",
    "employee.streak": "Série en cours",
    "employee.days": "jours",
    "employee.recentActivity": "Activité récente",
    "employee.riskEvolution": "Évolution de votre score",

    // Badges
    "badges.title": "Badges & Récompenses",
    "badges.earned": "badges obtenus",
    "badges.completion": "Complétion",
    "badges.unlocked": "Badges débloqués",
    "badges.inProgress": "En cours de progression",
    "badges.progress": "Progression",

    // Employee space extra
    "employee.phishingDetected": "Phishing détectés",
    "employee.quizAvgScore": "Score quiz moyen",
    "employee.progression": "Progression globale",
    "employee.certificate": "Certificat de sensibilisation",
    "employee.certificateDesc": "Complétez tous les modules pour obtenir votre certificat Rostel CyberSense",
    "employee.modulesRemaining": "modules restants",
    "employee.streakMessage": "jours d'affilée",
    "employee.riskDecreasing": "Votre score de risque baisse — continuez comme ça !",

    // Leaderboard
    "leaderboard.title": "Classement",
    "leaderboard.yourPosition": "Votre position",
    "leaderboard.points": "Points",
    "leaderboard.streakDays": "Jours série",
    "leaderboard.fullRanking": "Classement complet",
    "leaderboard.howToEarn": "Comment gagner des points ?",
    "leaderboard.detectPhishing": "Détecter un phishing",
    "leaderboard.completeTraining": "Terminer une formation",
    "leaderboard.dailyStreak": "Série quotidienne",
    "leaderboard.earnBadge": "Obtenir un badge",
    "leaderboard.you": "vous",

    // Landing
    "landing.hero.badge": "Plateforme de Human Security Training",
    "landing.hero.title1": "Transformez vos employés en",
    "landing.hero.title2": "bouclier cyber",
    "landing.hero.subtitle": "Simulez des attaques de phishing, formez vos équipes et suivez le score de risque humain de votre organisation — en temps réel.",
    "landing.hero.cta": "Commencer gratuitement",
    "landing.hero.demo": "Voir la démo",
    "landing.pricing": "Tarifs",
    "landing.testimonials": "Témoignages",
    "landing.cta.title": "Prêt à protéger vos équipes ?",
  },
  en: {
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.next": "Next",
    "common.search": "Search",
    "common.export": "Export",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.saved": "Saved!",
    "common.yes": "Yes",
    "common.no": "No",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.employees": "Employees",
    "nav.simulations": "Simulations",
    "nav.training": "Training",
    "nav.reports": "Reports & Analytics",
    "nav.settings": "Settings",
    "nav.profile": "My Profile",
    "nav.setup": "Setup",
    "nav.mySpace": "My Space",
    "nav.results": "My Results",
    "nav.badges": "Badges",
    "nav.leaderboard": "Leaderboard",
    "nav.logout": "Log out",
    "nav.about": "About",
    "nav.home": "Home",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.riskScore": "Average risk score",
    "dashboard.atRiskEmployees": "At-risk employees",
    "dashboard.trainingsCompleted": "Trainings completed",
    "dashboard.totalEmployees": "Total employees",
    "dashboard.riskEvolution": "Human risk evolution",
    "dashboard.riskByDept": "Risk by department",
    "dashboard.highRiskEmployees": "High-risk employees",
    "dashboard.thisMonth": "this month",
    "dashboard.outOf": "out of",
    "dashboard.employees": "employees",
    "dashboard.safeZone": "in safe zone",

    // Employees
    "employees.title": "Employees",
    "employees.search": "Search an employee...",
    "employees.name": "Name",
    "employees.department": "Department",
    "employees.role": "Role",
    "employees.riskScore": "Risk score",
    "employees.trainings": "Trainings",
    "employees.status": "Status",
    "employees.safe": "Safe",
    "employees.moderate": "Moderate",
    "employees.atRisk": "At risk",

    // Simulations
    "simulations.title": "Phishing simulations",
    "simulations.newCampaign": "New campaign",
    "simulations.activeCampaigns": "Active campaigns",
    "simulations.totalSent": "Emails sent",
    "simulations.clickRate": "Click rate",
    "simulations.reportRate": "Report rate",

    // Training
    "training.title": "Training modules",
    "training.start": "Start",
    "training.continue": "Continue",
    "training.completed": "Completed",
    "training.duration": "Duration",
    "training.minutes": "min",

    // Reports
    "reports.title": "Reports & Analytics",
    "reports.exportCSV": "Export CSV",
    "reports.exportPDF": "Export PDF",
    "reports.overview": "Overview",
    "reports.departments": "Departments",
    "reports.history": "History",
    "reports.riskEvolution": "Risk evolution",
    "reports.phishingTrend": "Phishing trend",
    "reports.statusDistribution": "Status distribution",

    // Settings
    "settings.title": "Settings",
    "settings.organization": "Organization",
    "settings.notifications": "Notifications",
    "settings.security": "Security",
    "settings.team": "Admin team",
    "settings.orgInfo": "Organization info",
    "settings.plan": "Plan & Subscription",

    // Profile
    "profile.title": "My Profile",
    "profile.personalInfo": "Personal information",
    "profile.firstName": "First name",
    "profile.lastName": "Last name",
    "profile.email": "Email address",
    "profile.phone": "Phone",
    "profile.position": "Position",
    "profile.department": "Department",
    "profile.language": "Language",
    "profile.notificationPrefs": "Notification preferences",
    "profile.security": "Security",
    "profile.currentPassword": "Current password",
    "profile.newPassword": "New password",
    "profile.confirmPassword": "Confirm",
    "profile.2fa": "Two-factor authentication",

    // Employee space
    "employee.welcome": "Welcome",
    "employee.yourRiskScore": "Your risk score",
    "employee.streak": "Current streak",
    "employee.days": "days",
    "employee.recentActivity": "Recent activity",
    "employee.riskEvolution": "Your score evolution",

    // Badges
    "badges.title": "Badges & Rewards",
    "badges.earned": "badges earned",
    "badges.completion": "Completion",
    "badges.unlocked": "Unlocked badges",
    "badges.inProgress": "In progress",
    "badges.progress": "Progress",

    // Employee space extra
    "employee.phishingDetected": "Phishing detected",
    "employee.quizAvgScore": "Quiz avg. score",
    "employee.progression": "Overall progress",
    "employee.certificate": "Awareness certificate",
    "employee.certificateDesc": "Complete all modules to earn your Rostel CyberSense certificate",
    "employee.modulesRemaining": "modules remaining",
    "employee.streakMessage": "days in a row",
    "employee.riskDecreasing": "Your risk score is going down — keep it up!",

    // Leaderboard
    "leaderboard.title": "Leaderboard",
    "leaderboard.yourPosition": "Your position",
    "leaderboard.points": "Points",
    "leaderboard.streakDays": "Streak days",
    "leaderboard.fullRanking": "Full ranking",
    "leaderboard.howToEarn": "How to earn points?",
    "leaderboard.detectPhishing": "Detect a phishing",
    "leaderboard.completeTraining": "Complete a training",
    "leaderboard.dailyStreak": "Daily streak",
    "leaderboard.earnBadge": "Earn a badge",
    "leaderboard.you": "you",

    // Landing
    "landing.hero.badge": "Human Security Training Platform",
    "landing.hero.title1": "Turn your employees into a",
    "landing.hero.title2": "cyber shield",
    "landing.hero.subtitle": "Simulate phishing attacks, train your teams and track your organization's human risk score — in real time.",
    "landing.hero.cta": "Get started for free",
    "landing.hero.demo": "Watch demo",
    "landing.pricing": "Pricing",
    "landing.testimonials": "Testimonials",
    "landing.cta.title": "Ready to protect your teams?",
  },
} as const;

type DictKey = keyof (typeof dictionaries)["fr"];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("cybersense_locale") as Locale) || "fr";
    }
    return "fr";
  });

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("cybersense_locale", newLocale);
  }, []);

  const t = useCallback(
    (key: DictKey): string => {
      return dictionaries[locale][key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}

export const companyInfo = {
  name: "Rostel CyberSense",
  tagline: "Human Security Training Platform",
  company: "Rostel High-Tech",
  currentOrg: "Safi Sénégal SARL",
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  riskScore: number;
  trainingsCompleted: number;
  totalTrainings: number;
  lastActive: string;
  avatar: string;
  status: "safe" | "moderate" | "at-risk";
};

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  completionRate: number;
  lessons: number;
  icon: string;
};

export type SimulationResult = {
  id: string;
  campaign: string;
  type: string;
  sentDate: string;
  totalTargets: number;
  opened: number;
  clicked: number;
  reported: number;
  ignored: number;
};

export type MonthlyStats = {
  month: string;
  riskScore: number;
  trainingsCompleted: number;
  phishingClicked: number;
};

export const employees: Employee[] = [
  {
    id: "1",
    name: "Aminata Diallo",
    email: "a.diallo@safisenegal.com",
    department: "Comptabilité",
    role: "Comptable senior",
    riskScore: 25,
    trainingsCompleted: 8,
    totalTrainings: 10,
    lastActive: "2026-05-11",
    avatar: "AD",
    status: "safe",
  },
  {
    id: "2",
    name: "Moussa Ndiaye",
    email: "m.ndiaye@safisenegal.com",
    department: "Commercial",
    role: "Directeur commercial",
    riskScore: 72,
    trainingsCompleted: 3,
    totalTrainings: 10,
    lastActive: "2026-05-08",
    avatar: "MN",
    status: "at-risk",
  },
  {
    id: "3",
    name: "Fatou Sow",
    email: "f.sow@safisenegal.com",
    department: "RH",
    role: "Responsable RH",
    riskScore: 45,
    trainingsCompleted: 6,
    totalTrainings: 10,
    lastActive: "2026-05-10",
    avatar: "FS",
    status: "moderate",
  },
  {
    id: "4",
    name: "Ibrahima Fall",
    email: "i.fall@safisenegal.com",
    department: "IT",
    role: "Administrateur réseau",
    riskScore: 15,
    trainingsCompleted: 10,
    totalTrainings: 10,
    lastActive: "2026-05-12",
    avatar: "IF",
    status: "safe",
  },
  {
    id: "5",
    name: "Coumba Sy",
    email: "c.sy@safisenegal.com",
    department: "Direction",
    role: "Assistante de direction",
    riskScore: 58,
    trainingsCompleted: 4,
    totalTrainings: 10,
    lastActive: "2026-05-06",
    avatar: "CS",
    status: "moderate",
  },
  {
    id: "6",
    name: "Ousmane Bâ",
    email: "o.ba@safisenegal.com",
    department: "Commercial",
    role: "Chargé de clientèle",
    riskScore: 82,
    trainingsCompleted: 2,
    totalTrainings: 10,
    lastActive: "2026-04-28",
    avatar: "OB",
    status: "at-risk",
  },
  {
    id: "7",
    name: "Mariama Traoré",
    email: "m.traore@safisenegal.com",
    department: "Marketing",
    role: "Community Manager",
    riskScore: 38,
    trainingsCompleted: 7,
    totalTrainings: 10,
    lastActive: "2026-05-11",
    avatar: "MT",
    status: "safe",
  },
  {
    id: "8",
    name: "Abdoulaye Diop",
    email: "a.diop@safisenegal.com",
    department: "Logistique",
    role: "Responsable logistique",
    riskScore: 65,
    trainingsCompleted: 3,
    totalTrainings: 10,
    lastActive: "2026-05-03",
    avatar: "AD",
    status: "at-risk",
  },
  {
    id: "9",
    name: "Aïssatou Camara",
    email: "a.camara@safisenegal.com",
    department: "Comptabilité",
    role: "Aide-comptable",
    riskScore: 30,
    trainingsCompleted: 7,
    totalTrainings: 10,
    lastActive: "2026-05-09",
    avatar: "AC",
    status: "safe",
  },
  {
    id: "10",
    name: "Pape Gueye",
    email: "p.gueye@safisenegal.com",
    department: "IT",
    role: "Développeur",
    riskScore: 20,
    trainingsCompleted: 9,
    totalTrainings: 10,
    lastActive: "2026-05-12",
    avatar: "PG",
    status: "safe",
  },
];

export const trainingModules: TrainingModule[] = [
  {
    id: "phishing-101",
    title: "Phishing & Spear-phishing",
    description:
      "Apprenez à identifier les emails de phishing, les liens suspects et les techniques d'hameçonnage ciblé.",
    category: "Phishing",
    duration: "8 min",
    difficulty: "Débutant",
    completionRate: 78,
    lessons: 5,
    icon: "🎣",
  },
  {
    id: "social-engineering",
    title: "Ingénierie sociale",
    description:
      "Comprenez les techniques de manipulation psychologique utilisées par les attaquants pour obtenir des informations.",
    category: "Ingénierie sociale",
    duration: "10 min",
    difficulty: "Intermédiaire",
    completionRate: 54,
    lessons: 6,
    icon: "🎭",
  },
  {
    id: "passwords-mfa",
    title: "Mots de passe & MFA",
    description:
      "Créez des mots de passe robustes et activez l'authentification multi-facteurs pour protéger vos comptes.",
    category: "Authentification",
    duration: "6 min",
    difficulty: "Débutant",
    completionRate: 85,
    lessons: 4,
    icon: "🔐",
  },
  {
    id: "fake-emails",
    title: "Faux emails professionnels",
    description:
      "Détectez les emails frauduleux imitant votre PDG, RH ou fournisseurs. Cas pratiques africains inclus.",
    category: "Phishing",
    duration: "7 min",
    difficulty: "Intermédiaire",
    completionRate: 62,
    lessons: 5,
    icon: "📧",
  },
  {
    id: "device-security",
    title: "Sécurité des appareils",
    description:
      "USB malveillantes, Wi-Fi public, Bluetooth : protégez vos appareils contre les menaces physiques.",
    category: "Sécurité physique",
    duration: "5 min",
    difficulty: "Débutant",
    completionRate: 71,
    lessons: 4,
    icon: "💻",
  },
  {
    id: "social-media-fraud",
    title: "Réseaux sociaux & Fraude",
    description:
      "Arnaque WhatsApp, faux profils, fraude Mobile Money : les menaces spécifiques au contexte africain.",
    category: "Réseaux sociaux",
    duration: "9 min",
    difficulty: "Avancé",
    completionRate: 45,
    lessons: 7,
    icon: "📱",
  },
];

export const simulationResults: SimulationResult[] = [
  {
    id: "sim-1",
    campaign: "Faux email RH — Bulletin de paie",
    type: "Email phishing",
    sentDate: "2026-05-01",
    totalTargets: 10,
    opened: 9,
    clicked: 4,
    reported: 3,
    ignored: 3,
  },
  {
    id: "sim-2",
    campaign: "Faux message PDG — Virement urgent",
    type: "Spear-phishing",
    sentDate: "2026-04-15",
    totalTargets: 10,
    opened: 8,
    clicked: 6,
    reported: 1,
    ignored: 3,
  },
  {
    id: "sim-3",
    campaign: "Faux fournisseur — Facture à régler",
    type: "Email phishing",
    sentDate: "2026-03-28",
    totalTargets: 10,
    opened: 10,
    clicked: 5,
    reported: 2,
    ignored: 3,
  },
];

export const monthlyStats: MonthlyStats[] = [
  { month: "Jan", riskScore: 68, trainingsCompleted: 12, phishingClicked: 8 },
  { month: "Fév", riskScore: 62, trainingsCompleted: 18, phishingClicked: 7 },
  { month: "Mar", riskScore: 55, trainingsCompleted: 25, phishingClicked: 5 },
  { month: "Avr", riskScore: 48, trainingsCompleted: 34, phishingClicked: 4 },
  { month: "Mai", riskScore: 42, trainingsCompleted: 41, phishingClicked: 3 },
];

export const departmentStats = [
  { name: "IT", riskScore: 18, employees: 2 },
  { name: "Comptabilité", riskScore: 28, employees: 2 },
  { name: "Marketing", riskScore: 38, employees: 1 },
  { name: "RH", riskScore: 45, employees: 1 },
  { name: "Direction", riskScore: 58, employees: 1 },
  { name: "Logistique", riskScore: 65, employees: 1 },
  { name: "Commercial", riskScore: 77, employees: 2 },
];

export const currentUser = {
  id: "3",
  name: "Fatou Sow",
  email: "f.sow@safisenegal.com",
  role: "admin",
  org: "Safi Sénégal SARL",
};

// ===== SUPER ADMIN (Rostel High-Tech) DATA =====

export type Organization = {
  id: string;
  name: string;
  country: string;
  city: string;
  sector: string;
  plan: "Starter" | "Business" | "Enterprise";
  employees: number;
  maxEmployees: number;
  riskScore: number;
  trainingsCompleted: number;
  campaignsRun: number;
  joinedDate: string;
  status: "active" | "trial" | "expired";
  contactName: string;
  contactEmail: string;
  mrr: number;
};

export const organizations: Organization[] = [
  {
    id: "org-1",
    name: "Safi Sénégal SARL",
    country: "Sénégal",
    city: "Dakar",
    sector: "Services financiers",
    plan: "Business",
    employees: 10,
    maxEmployees: 100,
    riskScore: 42,
    trainingsCompleted: 41,
    campaignsRun: 3,
    joinedDate: "2026-01-15",
    status: "active",
    contactName: "Fatou Sow",
    contactEmail: "f.sow@safisenegal.com",
    mrr: 450000,
  },
  {
    id: "org-2",
    name: "Banque Atlantique Sénégal",
    country: "Sénégal",
    city: "Dakar",
    sector: "Banque",
    plan: "Enterprise",
    employees: 85,
    maxEmployees: 500,
    riskScore: 35,
    trainingsCompleted: 312,
    campaignsRun: 8,
    joinedDate: "2025-11-01",
    status: "active",
    contactName: "Mamadou Diop",
    contactEmail: "m.diop@ba-senegal.com",
    mrr: 1200000,
  },
  {
    id: "org-3",
    name: "Université Cheikh Anta Diop",
    country: "Sénégal",
    city: "Dakar",
    sector: "Éducation",
    plan: "Starter",
    employees: 22,
    maxEmployees: 25,
    riskScore: 55,
    trainingsCompleted: 68,
    campaignsRun: 2,
    joinedDate: "2026-03-01",
    status: "active",
    contactName: "Pr. Awa Niang",
    contactEmail: "a.niang@ucad.edu.sn",
    mrr: 150000,
  },
  {
    id: "org-4",
    name: "Orange Côte d'Ivoire",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    sector: "Télécommunications",
    plan: "Enterprise",
    employees: 210,
    maxEmployees: 500,
    riskScore: 28,
    trainingsCompleted: 890,
    campaignsRun: 12,
    joinedDate: "2025-09-15",
    status: "active",
    contactName: "Kouamé Assi",
    contactEmail: "k.assi@orange.ci",
    mrr: 1500000,
  },
  {
    id: "org-5",
    name: "Groupe Bolloré Cameroun",
    country: "Cameroun",
    city: "Douala",
    sector: "Logistique",
    plan: "Business",
    employees: 45,
    maxEmployees: 100,
    riskScore: 48,
    trainingsCompleted: 156,
    campaignsRun: 5,
    joinedDate: "2026-02-10",
    status: "active",
    contactName: "Jean-Pierre Mbarga",
    contactEmail: "jp.mbarga@bollore.cm",
    mrr: 450000,
  },
  {
    id: "org-6",
    name: "Institut Pasteur de Dakar",
    country: "Sénégal",
    city: "Dakar",
    sector: "Santé / Recherche",
    plan: "Business",
    employees: 30,
    maxEmployees: 100,
    riskScore: 32,
    trainingsCompleted: 120,
    campaignsRun: 4,
    joinedDate: "2026-01-20",
    status: "active",
    contactName: "Dr. Ibrahima Sarr",
    contactEmail: "i.sarr@pasteur.sn",
    mrr: 450000,
  },
  {
    id: "org-7",
    name: "Startup Academy Abidjan",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    sector: "Éducation",
    plan: "Starter",
    employees: 8,
    maxEmployees: 25,
    riskScore: 62,
    trainingsCompleted: 18,
    campaignsRun: 1,
    joinedDate: "2026-04-20",
    status: "trial",
    contactName: "Marie Koffi",
    contactEmail: "m.koffi@startupacademy.ci",
    mrr: 0,
  },
  {
    id: "org-8",
    name: "Ecobank Togo",
    country: "Togo",
    city: "Lomé",
    sector: "Banque",
    plan: "Enterprise",
    employees: 120,
    maxEmployees: 500,
    riskScore: 38,
    trainingsCompleted: 480,
    campaignsRun: 7,
    joinedDate: "2025-12-01",
    status: "active",
    contactName: "Kodjo Amegbo",
    contactEmail: "k.amegbo@ecobank.tg",
    mrr: 1200000,
  },
];

export const platformStats = {
  totalOrganizations: 8,
  activeOrganizations: 7,
  totalEmployees: 530,
  totalTrainingsCompleted: 2085,
  totalCampaigns: 42,
  avgRiskScore: 42,
  mrrTotal: 5400000,
  mrrGrowth: 18,
  churnRate: 2.1,
};

export const revenueByMonth = [
  { month: "Jan", mrr: 3200000, newOrgs: 2 },
  { month: "Fév", mrr: 3650000, newOrgs: 1 },
  { month: "Mar", mrr: 4100000, newOrgs: 1 },
  { month: "Avr", mrr: 4800000, newOrgs: 1 },
  { month: "Mai", mrr: 5400000, newOrgs: 1 },
];

export const planDistribution = [
  { name: "Starter", value: 2, color: "#25d366" },
  { name: "Business", value: 3, color: "#fa990e" },
  { name: "Enterprise", value: 3, color: "#9c1e99" },
];

export const supportTickets = [
  { id: "T-001", org: "Safi Sénégal SARL", subject: "Problème d'export PDF", priority: "medium", status: "open", date: "2026-05-12" },
  { id: "T-002", org: "Banque Atlantique Sénégal", subject: "Configuration SSO Microsoft 365", priority: "high", status: "in-progress", date: "2026-05-11" },
  { id: "T-003", org: "Orange Côte d'Ivoire", subject: "Ajout de 50 employés supplémentaires", priority: "low", status: "resolved", date: "2026-05-10" },
  { id: "T-004", org: "Startup Academy Abidjan", subject: "Passage de Trial à Starter", priority: "medium", status: "open", date: "2026-05-09" },
  { id: "T-005", org: "Ecobank Togo", subject: "API webhook pour SIEM interne", priority: "high", status: "in-progress", date: "2026-05-08" },
];

export const badges = [
  {
    id: "cyber-defender",
    name: "Cyber Defender",
    description: "5 modules complétés",
    icon: "🛡️",
    earned: true,
  },
  {
    id: "phishing-hunter",
    name: "Phishing Hunter",
    description: "3 simulations signalées",
    icon: "🎯",
    earned: true,
  },
  {
    id: "perfect-score",
    name: "Score Parfait",
    description: "100% sur un quiz",
    icon: "⭐",
    earned: false,
  },
  {
    id: "streak-7",
    name: "7 jours consécutifs",
    description: "Connexion 7 jours de suite",
    icon: "🔥",
    earned: false,
  },
];

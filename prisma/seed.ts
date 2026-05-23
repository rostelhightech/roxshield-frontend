import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Organizations ──
  const safiSenegal = await prisma.organization.upsert({
    where: { id: "org_safi_senegal" },
    update: {},
    create: {
      id: "org_safi_senegal",
      name: "SAFI Sénégal",
      plan: "BUSINESS",
      sector: "Finance",
      country: "Sénégal",
      city: "Dakar",
      size: 45,
      isDemo: true,
    },
  });

  const ucad = await prisma.organization.upsert({
    where: { id: "org_ucad" },
    update: {},
    create: {
      id: "org_ucad",
      name: "UCAD - Université Cheikh Anta Diop",
      plan: "CAMPUS",
      sector: "Éducation",
      country: "Sénégal",
      city: "Dakar",
      size: 200,
      isDemo: true,
    },
  });

  const rostelhightech = await prisma.organization.upsert({
    where: { id: "org_rostel" },
    update: {},
    create: {
      id: "org_rostel",
      name: "Rostel High-Tech",
      plan: "ENTERPRISE",
      sector: "Technologie",
      country: "Sénégal",
      city: "Dakar",
      size: 10,
      isDemo: false,
    },
  });

  // ── Users ──
  const hashedDemo = await bcrypt.hash("demo1234", 12);
  const hashedAdmin = await bcrypt.hash("admin2024!", 12);

  const adminRostel = await prisma.user.upsert({
    where: { email: "admin@rostelhightech.com" },
    update: {},
    create: {
      email: "admin@rostelhightech.com",
      name: "Admin Rostel",
      password: hashedAdmin,
      role: "SUPER_ADMIN",
      department: "Direction",
      position: "CEO",
      riskScore: 15,
      organizationId: rostelhightech.id,
    },
  });

  const fatouSow = await prisma.user.upsert({
    where: { email: "f.sow@safisenegal.com" },
    update: {},
    create: {
      email: "f.sow@safisenegal.com",
      name: "Fatou Sow",
      password: hashedDemo,
      role: "ADMIN",
      department: "IT",
      position: "DSI",
      riskScore: 22,
      organizationId: safiSenegal.id,
    },
  });

  const employees = [
    { email: "a.diallo@safisenegal.com", name: "Aminata Diallo", dept: "Finance", position: "Comptable", risk: 68 },
    { email: "m.ndiaye@safisenegal.com", name: "Moussa Ndiaye", dept: "Commercial", position: "Directeur Commercial", risk: 45 },
    { email: "k.ba@safisenegal.com", name: "Khady Ba", dept: "RH", position: "Responsable RH", risk: 38 },
    { email: "o.fall@safisenegal.com", name: "Ousmane Fall", dept: "IT", position: "Développeur", risk: 12 },
    { email: "m.diop@safisenegal.com", name: "Mariama Diop", dept: "Direction", position: "Assistante Direction", risk: 72 },
    { email: "i.sarr@safisenegal.com", name: "Ibrahima Sarr", dept: "Finance", position: "CFO", risk: 55 },
    { email: "a.gueye@safisenegal.com", name: "Awa Gueye", dept: "Commercial", position: "Chargée de clientèle", risk: 61 },
    { email: "p.mendy@safisenegal.com", name: "Pierre Mendy", dept: "IT", position: "Admin Système", risk: 18 },
    { email: "s.toure@safisenegal.com", name: "Souleymane Touré", dept: "Opérations", position: "Responsable Logistique", risk: 43 },
    { email: "n.faye@safisenegal.com", name: "Ndèye Faye", dept: "Juridique", position: "Juriste", risk: 30 },
  ];

  const createdEmployees: any[] = [];
  for (const emp of employees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        name: emp.name,
        password: hashedDemo,
        role: "EMPLOYEE",
        department: emp.dept,
        position: emp.position,
        riskScore: emp.risk,
        organizationId: safiSenegal.id,
      },
    });
    createdEmployees.push(user);
  }

  await prisma.user.upsert({
    where: { email: "prof@demo.roxshield.com" },
    update: {},
    create: {
      email: "prof@demo.roxshield.com",
      name: "Professeur Démo",
      password: hashedDemo,
      role: "ADMIN",
      department: "Direction",
      position: "Consultant Cybersécurité",
      riskScore: 10,
      organizationId: safiSenegal.id,
    },
  });

  // ── Module 2 : Campagnes de Phishing ──
  console.log("  📧 Campagnes de phishing...");

  const campaigns = [
    {
      id: "camp_1",
      name: "Mobile Money - Vérification Orange Money",
      templateType: "mobile_money",
      status: "COMPLETED" as const,
      targetDepts: ["Finance", "Commercial", "RH"],
      totalTargets: 8,
      sentCount: 8,
      clickCount: 3,
      reportCount: 4,
      startedAt: new Date("2025-04-01"),
      completedAt: new Date("2025-04-08"),
    },
    {
      id: "camp_2",
      name: "Banque - Mise à jour coordonnées BICIS",
      templateType: "bank",
      status: "COMPLETED" as const,
      targetDepts: ["Finance", "Direction"],
      totalTargets: 4,
      sentCount: 4,
      clickCount: 2,
      reportCount: 1,
      startedAt: new Date("2025-04-15"),
      completedAt: new Date("2025-04-22"),
    },
    {
      id: "camp_3",
      name: "IT Interne - Réinitialisation mot de passe",
      templateType: "internal",
      status: "ACTIVE" as const,
      targetDepts: ["IT", "RH", "Commercial", "Finance", "Direction", "Opérations", "Juridique"],
      totalTargets: 12,
      sentCount: 12,
      clickCount: 1,
      reportCount: 6,
      startedAt: new Date("2025-05-10"),
    },
    {
      id: "camp_4",
      name: "Livraison DHL - Colis en attente",
      templateType: "delivery",
      status: "DRAFT" as const,
      targetDepts: ["Opérations", "Commercial"],
      totalTargets: 4,
      sentCount: 0,
      clickCount: 0,
      reportCount: 0,
    },
  ];

  for (const camp of campaigns) {
    await prisma.phishingCampaign.upsert({
      where: { id: camp.id },
      update: {},
      create: { ...camp, organizationId: safiSenegal.id },
    });
  }

  // ── Module 3 : Formations ──
  console.log("  🎓 Modules de formation...");

  const trainingModules = [
    { id: "train_1", title: "Reconnaître un email de phishing", category: "phishing", difficulty: "beginner", durationMinutes: 8, badgeName: "Détecteur de Phishing", badgeIcon: "🎣" },
    { id: "train_2", title: "Mots de passe sécurisés & MFA", category: "passwords", difficulty: "beginner", durationMinutes: 10, badgeName: "Gardien des Clés", badgeIcon: "🔑" },
    { id: "train_3", title: "Ingénierie sociale : les techniques", category: "social_engineering", difficulty: "intermediate", durationMinutes: 15, badgeName: "Anti-Manipulateur", badgeIcon: "🧠" },
    { id: "train_4", title: "Protection des données personnelles", category: "data_protection", difficulty: "beginner", durationMinutes: 12, badgeName: "Protecteur RGPD", badgeIcon: "🛡️" },
    { id: "train_5", title: "Sécurité Mobile & BYOD", category: "mobile_security", difficulty: "intermediate", durationMinutes: 10, badgeName: "Mobile Sécurisé", badgeIcon: "📱" },
    { id: "train_6", title: "Arnaques Mobile Money", category: "phishing", difficulty: "beginner", durationMinutes: 8, badgeName: "Anti-Arnaque", badgeIcon: "💸" },
  ];

  for (const mod of trainingModules) {
    await prisma.trainingModule.upsert({
      where: { id: mod.id },
      update: {},
      create: {
        ...mod,
        description: `Module de formation : ${mod.title}`,
        organizationId: null, // global
      },
    });
  }

  // Progression des employés
  const progressData = [
    { userId: createdEmployees[0].id, moduleId: "train_1", status: "COMPLETED" as const, progressPercent: 100, quizScore: 60 },
    { userId: createdEmployees[0].id, moduleId: "train_2", status: "IN_PROGRESS" as const, progressPercent: 40, quizScore: null },
    { userId: createdEmployees[1].id, moduleId: "train_1", status: "COMPLETED" as const, progressPercent: 100, quizScore: 85 },
    { userId: createdEmployees[1].id, moduleId: "train_3", status: "COMPLETED" as const, progressPercent: 100, quizScore: 78 },
    { userId: createdEmployees[2].id, moduleId: "train_1", status: "COMPLETED" as const, progressPercent: 100, quizScore: 92 },
    { userId: createdEmployees[3].id, moduleId: "train_1", status: "COMPLETED" as const, progressPercent: 100, quizScore: 95 },
    { userId: createdEmployees[3].id, moduleId: "train_2", status: "COMPLETED" as const, progressPercent: 100, quizScore: 100 },
    { userId: createdEmployees[3].id, moduleId: "train_3", status: "COMPLETED" as const, progressPercent: 100, quizScore: 88 },
    { userId: createdEmployees[4].id, moduleId: "train_6", status: "IN_PROGRESS" as const, progressPercent: 25, quizScore: null },
    { userId: createdEmployees[5].id, moduleId: "train_1", status: "COMPLETED" as const, progressPercent: 100, quizScore: 70 },
  ];

  for (const p of progressData) {
    await prisma.trainingProgress.upsert({
      where: { userId_moduleId: { userId: p.userId, moduleId: p.moduleId } },
      update: {},
      create: {
        ...p,
        completedAt: p.status === "COMPLETED" ? new Date("2025-05-01") : null,
      },
    });
  }

  // ── Module 5 : Menaces Email ──
  console.log("  📨 Menaces email...");

  const threats = [
    { type: "phishing", subject: "Votre compte Orange Money a été suspendu", senderEmail: "support@0range-money.com", targetDept: "Finance", severity: "HIGH" as const, status: "BLOCKED" as const },
    { type: "bec", subject: "Virement urgent - Confidentiel", senderEmail: "dg@safi-senegal.com", targetDept: "Finance", severity: "CRITICAL" as const, status: "BLOCKED" as const },
    { type: "spear_phishing", subject: "Invitation réunion conseil d'administration", senderEmail: "secretariat@safigroup.com", targetDept: "Direction", severity: "HIGH" as const, status: "INVESTIGATING" as const },
    { type: "spoofing", subject: "Facture en attente de validation", senderEmail: "compta@safi-senegal.org", targetDept: "Finance", severity: "MEDIUM" as const, status: "BLOCKED" as const },
    { type: "malware", subject: "Nouveau contrat de partenariat.pdf.exe", senderEmail: "partenaire@legit-corp.com", targetDept: "Commercial", severity: "CRITICAL" as const, status: "BLOCKED" as const },
    { type: "phishing", subject: "Mise à jour de votre mot de passe Wave", senderEmail: "securite@wave-digital.com", targetDept: "RH", severity: "MEDIUM" as const, status: "RESOLVED" as const },
  ];

  for (const threat of threats) {
    await prisma.emailThreat.create({
      data: {
        ...threat,
        targetEmail: `user@safisenegal.com`,
        organizationId: safiSenegal.id,
        detectedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // derniers 30 jours
      },
    });
  }

  // ── Module 6 : Audit Mots de Passe ──
  console.log("  🔑 Audit mots de passe...");

  await prisma.passwordAudit.create({
    data: {
      totalAccounts: 45,
      weakPasswords: 12,
      reusedPasswords: 8,
      noMfaCount: 18,
      mfaEnabled: 27,
      avgStrength: 62,
      issues: [
        { type: "weak", count: 12, description: "Mots de passe de moins de 8 caractères" },
        { type: "reused", count: 8, description: "Mots de passe utilisés sur plusieurs comptes" },
        { type: "no_special", count: 15, description: "Pas de caractères spéciaux" },
        { type: "no_mfa", count: 18, description: "MFA non activé" },
      ],
      recommendations: [
        "Imposer une longueur minimale de 12 caractères",
        "Activer le MFA obligatoire pour tous les comptes",
        "Mettre en place un gestionnaire de mots de passe entreprise",
        "Former les employés aux bonnes pratiques",
      ],
      organizationId: safiSenegal.id,
    },
  });

  // ── Module 7 : Shadow IT ──
  console.log("  👻 Shadow IT...");

  const shadowApps = [
    { appName: "ChatGPT", category: "ai_tools", usersCount: 15, departments: ["IT", "Commercial", "Direction"], riskLevel: "HIGH" as const, dataExposure: "high" },
    { appName: "WeTransfer", category: "cloud_storage", usersCount: 8, departments: ["Commercial", "RH"], riskLevel: "MEDIUM" as const, dataExposure: "medium" },
    { appName: "WhatsApp Business", category: "messaging", usersCount: 30, departments: ["Commercial", "RH", "Direction", "Opérations"], riskLevel: "MEDIUM" as const, dataExposure: "medium" },
    { appName: "Notion", category: "project_mgmt", usersCount: 6, departments: ["IT", "Direction"], riskLevel: "LOW" as const, dataExposure: "low", isApproved: true },
    { appName: "Dropbox Personnel", category: "cloud_storage", usersCount: 4, departments: ["Finance", "Juridique"], riskLevel: "CRITICAL" as const, dataExposure: "high" },
  ];

  for (const app of shadowApps) {
    await prisma.shadowItApp.create({
      data: { ...app, isApproved: app.isApproved ?? false, organizationId: safiSenegal.id },
    });
  }

  // ── Module 8 : Audit Chiffrement ──
  console.log("  🔐 Audit chiffrement...");

  const encryptionZones = [
    { zone: "storage", score: 75, status: "warning", findings: ["Base de données chiffrée AES-256", "Sauvegardes non chiffrées", "Disques locaux sans BitLocker"] },
    { zone: "transit", score: 90, status: "compliant", findings: ["TLS 1.3 sur tous les endpoints", "HSTS activé", "Certificats valides"] },
    { zone: "endpoints", score: 55, status: "warning", findings: ["60% des postes avec chiffrement disque", "Clés USB non contrôlées", "Pas de DLP"] },
    { zone: "email", score: 40, status: "non_compliant", findings: ["Pas de chiffrement S/MIME", "DMARC en mode surveillance seulement", "SPF configuré mais pas strict"] },
    { zone: "cloud", score: 82, status: "compliant", findings: ["Données chiffrées au repos sur Neon", "Accès via HTTPS uniquement", "Rotation des clés trimestrielle"] },
  ];

  for (const zone of encryptionZones) {
    await prisma.encryptionAudit.create({
      data: {
        zone: zone.zone,
        score: zone.score,
        status: zone.status,
        findings: zone.findings,
        organizationId: safiSenegal.id,
      },
    });
  }

  // ── Module 4 : GRC & Conformité ──
  console.log("  📋 GRC & Conformité...");

  const frameworks = [
    { id: "grc_1", name: "ISO 27001", overallScore: 58, status: "in_progress" },
    { id: "grc_2", name: "NIST CSF", overallScore: 45, status: "in_progress" },
    { id: "grc_3", name: "RGPD", overallScore: 72, status: "in_progress" },
    { id: "grc_4", name: "PCI DSS", overallScore: 35, status: "non_compliant" },
  ];

  for (const fw of frameworks) {
    await prisma.complianceFramework.upsert({
      where: { id: fw.id },
      update: {},
      create: { ...fw, organizationId: safiSenegal.id },
    });
  }

  const risks = [
    { title: "Phishing employés Finance", category: "human", likelihood: 4, impact: 5, riskScore: 20, status: "mitigating", mitigation: "Campagnes de simulation en cours" },
    { title: "Mots de passe faibles", category: "technical", likelihood: 4, impact: 4, riskScore: 16, status: "open", mitigation: "Politique MFA en déploiement" },
    { title: "Shadow IT non contrôlé", category: "process", likelihood: 3, impact: 4, riskScore: 12, status: "open" },
    { title: "Données non chiffrées email", category: "technical", likelihood: 3, impact: 5, riskScore: 15, status: "mitigating", mitigation: "Migration vers S/MIME planifiée" },
    { title: "Non-conformité RGPD partielle", category: "compliance", likelihood: 2, impact: 5, riskScore: 10, status: "mitigating", mitigation: "Audit en cours avec DPO externe" },
  ];

  for (const risk of risks) {
    await prisma.riskEntry.create({
      data: { ...risk, owner: "Fatou Sow (DSI)", organizationId: safiSenegal.id },
    });
  }

  // ── Activité récente ──
  console.log("  📝 Activité récente...");

  const activities = [
    { action: "login", description: "Connexion au dashboard", userId: fatouSow.id },
    { action: "campaign_created", description: "Campagne 'IT Interne - Réinitialisation mot de passe' créée", userId: fatouSow.id },
    { action: "training_completed", description: "Formation 'Reconnaître un email de phishing' complétée", userId: createdEmployees[0].id },
    { action: "threat_blocked", description: "Email BEC bloqué - 'Virement urgent' ", userId: null },
    { action: "training_completed", description: "Formation 'Mots de passe sécurisés' complétée", userId: createdEmployees[3].id },
    { action: "report_generated", description: "Rapport mensuel de risque généré", userId: fatouSow.id },
    { action: "user_flagged", description: "Mariama Diop signalée - score de risque élevé (72)", userId: null },
  ];

  for (let i = 0; i < activities.length; i++) {
    await prisma.activityLog.create({
      data: {
        ...activities[i],
        organizationId: safiSenegal.id,
        createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000), // espacées de 3h
      },
    });
  }

  // ── Notifications ──
  console.log("  🔔 Notifications...");

  const notifs = [
    { title: "Nouvelle menace détectée", message: "Un email BEC ciblant le département Finance a été bloqué", type: "warning", userId: fatouSow.id },
    { title: "Campagne terminée", message: "La campagne 'Mobile Money' est terminée. Taux de clic : 37%", type: "info", userId: fatouSow.id },
    { title: "Formation complétée", message: "Ousmane Fall a terminé le module 'Mots de passe sécurisés' avec 100%", type: "success", userId: fatouSow.id },
    { title: "Employé à risque", message: "Mariama Diop a un score de risque de 72. Action recommandée.", type: "error", userId: fatouSow.id },
  ];

  for (const notif of notifs) {
    await prisma.notification.create({ data: notif });
  }

  console.log("");
  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("📋 Demo accounts:");
  console.log("  Super Admin : admin@rostelhightech.com / admin2024!");
  console.log("  Admin Demo  : f.sow@safisenegal.com / demo1234");
  console.log("  Prof Demo   : prof@demo.roxshield.com / demo1234");
  console.log("  Employee    : a.diallo@safisenegal.com / demo1234");
  console.log("");
  console.log("📊 Demo data:");
  console.log("  4 campagnes de phishing");
  console.log("  6 modules de formation");
  console.log("  6 menaces email");
  console.log("  5 apps Shadow IT");
  console.log("  5 audits chiffrement (5 zones)");
  console.log("  4 frameworks GRC");
  console.log("  5 entrées registre des risques");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

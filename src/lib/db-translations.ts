/**
 * Client-side translations for data stored in French in the database.
 * Maps known French strings to their English equivalents.
 * When locale is "fr", returns the original string unchanged.
 */

const dbTranslations: Record<string, string> = {
  // Training module titles
  "Reconnaître un email de phishing": "Recognizing a phishing email",
  "Mots de passe sécurisés & MFA": "Secure passwords & MFA",
  "Ingénierie sociale : les techniques": "Social engineering: techniques",
  "Protection des données personnelles": "Personal data protection",
  "Sécurité Mobile & BYOD": "Mobile Security & BYOD",
  "Arnaques Mobile Money": "Mobile Money scams",

  // Training module descriptions (pattern: "Module de formation : <title>")
  "Module de formation : Reconnaître un email de phishing": "Training module: Recognizing a phishing email",
  "Module de formation : Mots de passe sécurisés & MFA": "Training module: Secure passwords & MFA",
  "Module de formation : Ingénierie sociale : les techniques": "Training module: Social engineering: techniques",
  "Module de formation : Protection des données personnelles": "Training module: Personal data protection",
  "Module de formation : Sécurité Mobile & BYOD": "Training module: Mobile Security & BYOD",
  "Module de formation : Arnaques Mobile Money": "Training module: Mobile Money scams",

  // Training badge names
  "Détecteur de Phishing": "Phishing Detector",
  "Gardien des Clés": "Key Guardian",
  "Anti-Manipulateur": "Anti-Manipulator",
  "Protecteur RGPD": "GDPR Protector",
  "Mobile Sécurisé": "Secure Mobile",
  "Anti-Arnaque": "Anti-Scam",

  // GRC risk titles
  "Phishing employés Finance": "Finance employee phishing",
  "Mots de passe faibles": "Weak passwords",
  "Shadow IT non contrôlé": "Uncontrolled Shadow IT",
  "Données non chiffrées email": "Unencrypted email data",
  "Non-conformité RGPD partielle": "Partial GDPR non-compliance",

  // GRC risk mitigations
  "Campagnes de simulation en cours": "Simulation campaigns in progress",
  "Politique MFA en déploiement": "MFA policy being deployed",
  "Migration vers S/MIME planifiée": "S/MIME migration planned",
  "Audit en cours avec DPO externe": "Audit in progress with external DPO",

  // Badge definitions
  "Premiers pas": "First steps",
  "Complétez votre première formation": "Complete your first training",
  "Œil de lynx": "Eagle eye",
  "Détectez 3 tentatives de phishing": "Detect 3 phishing attempts",
  "Cyber Défenseur": "Cyber Defender",
  "Complétez 3 formations": "Complete 3 trainings",
  "Série de 7": "7-day streak",
  "Connectez-vous 7 jours consécutifs": "Log in 7 consecutive days",
  "Score parfait": "Perfect score",
  "Obtenez 100% à un quiz": "Get 100% on a quiz",

  // Email threat subjects
  "Votre compte Orange Money a été suspendu": "Your Orange Money account has been suspended",
  "Virement urgent - Confidentiel": "Urgent transfer - Confidential",
  "Invitation réunion conseil d'administration": "Board meeting invitation",
  "Facture en attente de validation": "Invoice pending validation",
  "Nouveau contrat de partenariat.pdf.exe": "New partnership contract.pdf.exe",
  "Mise à jour de votre mot de passe Wave": "Update your Wave password",

  // Password audit descriptions
  "Mots de passe de moins de 8 caractères": "Passwords with fewer than 8 characters",
  "Mots de passe utilisés sur plusieurs comptes": "Passwords reused across multiple accounts",

  // Encryption audit findings
  "Données chiffrées au repos sur Neon": "Data encrypted at rest on Neon",
  "Accès via HTTPS uniquement": "HTTPS-only access",
  "Rotation des clés trimestrielle": "Quarterly key rotation",

  // Password audit issues
  "Pas de caractères spéciaux": "No special characters",
  "MFA non activé": "MFA not enabled",

  // Training categories
  "phishing": "phishing",
  "passwords": "passwords",
  "social_engineering": "social engineering",
  "data_protection": "data protection",
  "mobile_security": "mobile security",
};

/**
 * Translate a database string to the current locale.
 * Returns the original string if locale is "fr" or no translation exists.
 */
export function translateDb(text: string | null | undefined, locale: string): string {
  if (!text) return "";
  if (locale === "fr") return text;
  return dbTranslations[text] || text;
}

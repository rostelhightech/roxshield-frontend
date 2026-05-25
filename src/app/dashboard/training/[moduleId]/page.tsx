"use client";

import { use, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Play,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";
import { useTranslation } from "@/lib/i18n";

type Lesson = {
  title: string;
  content: string[];
  tip?: string;
  warning?: string;
};

type Quiz = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const moduleContentByLocale: Record<string, Record<string, { lessons: Lesson[]; quiz: Quiz[] }>> = {
  fr: {
    "phishing-101": {
      lessons: [
        { title: "Qu'est-ce que le phishing ?", content: ["Le phishing est une technique d'escroquerie en ligne ou un attaquant se fait passer pour une entite de confiance (banque, employeur, service public) afin de voler vos informations personnelles.", "En Afrique, les attaques ciblent souvent les services Mobile Money, les virements bancaires et les communications internes d'entreprise."], tip: "95% des cyberattaques reussies commencent par un email de phishing." },
        { title: "Reconnaitre un email de phishing", content: ["Les signes d'alerte incluent : adresse d'expediteur suspecte, urgence artificielle, fautes d'orthographe, liens raccourcis ou non reconnus.", "Verifiez toujours l'adresse email complete de l'expediteur, pas seulement le nom affiche."], warning: "Ne cliquez jamais sur un lien dans un email urgent sans verifier l'expediteur par un autre canal." },
        { title: "Que faire face a un email suspect ?", content: ["1. Ne cliquez sur aucun lien et n'ouvrez aucune piece jointe.", "2. Verifiez l'identite de l'expediteur par telephone ou en personne.", "3. Signalez l'email a votre service informatique.", "4. Supprimez l'email de votre boite de reception."], tip: "Votre service IT prefere recevoir 10 fausses alertes qu'ignorer 1 vraie attaque." },
      ],
      quiz: [
        { question: "Vous recevez un email de votre PDG demandant un virement urgent. Que faites-vous ?", options: ["J'effectue le virement immediatement", "Je verifie l'adresse email et contacte le PDG par telephone", "J'ignore l'email", "Je le transfere a un collegue"], correct: 1, explanation: "Toujours verifier par un canal different (telephone, en personne) avant d'agir sur un email urgent impliquant de l'argent." },
        { question: "Quel element est le plus fiable pour identifier un email de phishing ?", options: ["Le logo de l'entreprise", "L'adresse email complete de l'expediteur", "La mise en page professionnelle", "La signature en bas de l'email"], correct: 1, explanation: "Les logos et mises en page sont faciles a copier. L'adresse email de l'expediteur est le premier indicateur a verifier." },
        { question: "Un collegue vous transfere un email suspect. Que devez-vous faire ?", options: ["Cliquer sur le lien pour verifier s'il est dangereux", "Le signaler au service IT", "Repondre a l'expediteur original", "L'archiver sans rien faire"], correct: 1, explanation: "Signalez toujours les emails suspects au service IT. Ne cliquez jamais sur les liens pour tester." },
      ],
    },
    "social-engineering": {
      lessons: [
        { title: "L'ingenierie sociale expliquee", content: ["L'ingenierie sociale exploite la psychologie humaine plutot que les failles techniques. L'attaquant manipule votre confiance, votre peur ou votre empressement.", "Techniques courantes : pretexte (fausse identite), appat (cle USB abandonnee), quid pro quo (fausse aide technique)."], tip: "L'humain est souvent le maillon le plus faible de la chaine de securite." },
        { title: "Cas pratiques en entreprise", content: ["Un technicien IT vous appelle pour resoudre un probleme et demande vos identifiants.", "Un visiteur se presente comme livreur et branche une cle USB dans un PC non verrouille.", "Un email de la direction demande d'urgence les coordonnees bancaires de l'entreprise."], warning: "Un vrai technicien IT n'a jamais besoin de votre mot de passe. Si on vous le demande, c'est une attaque." },
        { title: "Se proteger au quotidien", content: ["Appliquez la regle du Verifier avant d'agir : confirmez toute demande sensible par un second canal.", "Verrouillez votre poste quand vous le quittez, meme 30 secondes.", "Ne laissez jamais un inconnu acceder a vos systemes sans autorisation verifiee."], tip: "Un simple reflexe de verification peut bloquer 90% des tentatives d'ingenierie sociale." },
      ],
      quiz: [
        { question: "Quelqu'un se presente comme technicien IT et demande votre mot de passe. Que faites-vous ?", options: ["Je donne mon mot de passe car c'est l'IT", "Je refuse et contacte moi-meme le service IT", "Je donne un ancien mot de passe", "Je demande son nom et je le lui donne ensuite"], correct: 1, explanation: "Un vrai technicien IT n'a jamais besoin de votre mot de passe. Contactez vous-meme le service via les canaux officiels." },
        { question: "Vous trouvez une cle USB dans le parking de l'entreprise. Que faites-vous ?", options: ["Je la branche sur mon PC pour identifier le proprietaire", "Je la remets au service IT sans la brancher", "Je la jette", "Je la garde pour usage personnel"], correct: 1, explanation: "Les cles USB abandonnees sont un vecteur d'attaque classique. Remettez-la au service IT." },
        { question: "Quelle est la meilleure defense contre l'ingenierie sociale ?", options: ["Un bon antivirus", "Verifier toute demande sensible par un second canal", "Ne jamais parler a des inconnus", "Changer son mot de passe tous les jours"], correct: 1, explanation: "La verification par un second canal est la parade la plus efficace contre la manipulation." },
      ],
    },
    "passwords-mfa": {
      lessons: [
        { title: "Creer un mot de passe robuste", content: ["Un bon mot de passe fait au moins 12 caracteres et melange majuscules, minuscules, chiffres et symboles.", "Technique efficace : une phrase de passe. Ex: MonChien@Mange3Pommes! est bien plus solide que P@ss123."], tip: "Un mot de passe de 12 caracteres mixtes prend des milliers d'annees a craquer par force brute." },
        { title: "L'authentification multi-facteurs (MFA)", content: ["La MFA ajoute une couche de securite : meme si votre mot de passe est vole, l'attaquant ne peut pas se connecter sans le second facteur.", "Types de MFA : SMS (acceptable), application d'authentification (recommande), cle physique (optimal)."], warning: "La MFA par SMS peut etre interceptee via SIM swapping, courant en Afrique. Preferez une app comme Google Authenticator." },
        { title: "Gestionnaire de mots de passe", content: ["Utilisez un gestionnaire (Bitwarden, 1Password) pour stocker tous vos mots de passe. Vous n'avez qu'un seul mot de passe maitre a retenir.", "Ne reutilisez jamais le meme mot de passe sur plusieurs services."], tip: "Un gestionnaire de mots de passe est l'outil de securite le plus rentable pour une entreprise." },
      ],
      quiz: [
        { question: "Quel mot de passe est le plus securise ?", options: ["P@ssw0rd!", "MonChien@Mange3Pommes!", "123456789", "admin2024"], correct: 1, explanation: "Une phrase de passe longue avec des caracteres speciaux est beaucoup plus difficile a craquer." },
        { question: "Pourquoi la MFA par application est-elle preferable au SMS ?", options: ["C'est plus rapide", "Le SMS peut etre intercepte via SIM swapping", "L'app est gratuite", "Le SMS coute cher"], correct: 1, explanation: "Le SIM swapping permet a un attaquant de transferer votre numero sur sa carte SIM et d'intercepter les codes SMS." },
        { question: "Vous utilisez le meme mot de passe pour votre email pro et un site de shopping. Le site est pirate. Que risquez-vous ?", options: ["Rien, les mots de passe sont chiffres", "L'attaquant peut acceder a mon email professionnel", "Seulement mon compte shopping est compromis", "Mon antivirus me protege"], correct: 1, explanation: "La reutilisation de mots de passe signifie qu'un seul piratage compromet tous vos comptes." },
      ],
    },
    "fake-emails": {
      lessons: [
        { title: "Les types d'emails frauduleux", content: ["BEC (Business Email Compromise) : l'attaquant usurpe l'identite du PDG ou d'un fournisseur pour demander des virements.", "En Afrique, les fraudes au virement et les arnaques fournisseur sont particulierement repandues dans les PME."], warning: "Les pertes dues au BEC depassent 43 milliards de dollars dans le monde." },
        { title: "Analyser un email suspect", content: ["Verifiez l'adresse complete (pas juste le nom affiche). Survolez les liens SANS cliquer pour voir l'URL reelle.", "Mefiez-vous des demandes urgentes, des changements de RIB fournisseur, et des pieces jointes inattendues (.exe, .zip, .scr)."], tip: "Une demande de changement de coordonnees bancaires d'un fournisseur doit TOUJOURS etre verifiee par telephone." },
        { title: "Protocole de signalement", content: ["1. Ne repondez pas et ne transferez pas l'email.", "2. Capturez une capture d'ecran de l'email complet.", "3. Signalez immediatement au service IT/securite.", "4. Prevenez vos collegues si la campagne semble cibler plusieurs personnes."] },
      ],
      quiz: [
        { question: "Un fournisseur habituel vous envoie un email demandant de changer son RIB. Que faites-vous ?", options: ["Je mets a jour le RIB dans le systeme", "J'appelle le fournisseur a son numero habituel pour verifier", "Je reponds a l'email pour confirmer", "J'attends la prochaine facture"], correct: 1, explanation: "Les fraudes au changement de RIB sont tres courantes. Verifiez TOUJOURS par telephone." },
        { question: "Comment verifier un lien dans un email sans danger ?", options: ["En cliquant dessus rapidement", "En survolant le lien avec la souris pour voir l'URL", "En le copiant dans Google", "En demandant a un collegue de cliquer"], correct: 1, explanation: "Survoler un lien revele l'URL reelle sans declencher le lien." },
        { question: "Quel type de piece jointe est le plus dangereux ?", options: ["Un PDF de facture (.pdf)", "Un fichier .exe ou .scr", "Une image (.jpg)", "Un document Word (.docx)"], correct: 1, explanation: "Les fichiers .exe et .scr sont des executables qui peuvent installer des malwares." },
      ],
    },
    "device-security": {
      lessons: [
        { title: "Menaces physiques sur vos appareils", content: ["Les attaques ne viennent pas que d'Internet. Une cle USB malveillante, un Wi-Fi public ou un regard par-dessus l'epaule sont des menaces reelles.", "En contexte africain, les cybercafes, hotels et espaces de coworking sont des zones a risque eleve."], warning: "Ne branchez JAMAIS une cle USB d'origine inconnue sur votre ordinateur professionnel." },
        { title: "Securiser votre poste de travail", content: ["Verrouillez votre ecran des que vous quittez votre poste (Win+L ou Cmd+Ctrl+Q).", "Activez le chiffrement complet du disque (BitLocker sur Windows, FileVault sur Mac).", "Gardez votre systeme et vos logiciels a jour."], tip: "Un ordinateur non verrouille pendant 30 secondes suffit pour installer un keylogger." },
        { title: "Wi-Fi public et VPN", content: ["Le Wi-Fi public (hotels, cafes, aeroports) n'est pas chiffre. Tout ce que vous transmettez peut etre intercepte.", "Utilisez toujours un VPN sur les reseaux publics."], tip: "Si vous n'avez pas de VPN, utilisez votre partage de connexion mobile plutot que le Wi-Fi public." },
      ],
      quiz: [
        { question: "Vous etes en deplacement et devez envoyer un virement. Le Wi-Fi de l'hotel est disponible. Que faites-vous ?", options: ["J'utilise le Wi-Fi directement", "J'utilise un VPN ou mon partage de connexion mobile", "J'attends d'etre au bureau", "Je demande le mot de passe Wi-Fi a la reception"], correct: 1, explanation: "Le Wi-Fi d'hotel peut etre intercepte. Un VPN ou votre connexion mobile chiffree est plus sur." },
        { question: "Quelle est la premiere action a faire en quittant votre bureau ?", options: ["Eteindre l'ecran", "Verrouiller la session (Win+L / Cmd+Ctrl+Q)", "Fermer la porte du bureau", "Mettre le PC en veille"], correct: 1, explanation: "Verrouiller la session empeche toute personne d'acceder a vos donnees en votre absence." },
        { question: "Pourquoi le chiffrement du disque est-il important ?", options: ["Il accelere l'ordinateur", "En cas de vol, les donnees restent illisibles sans le mot de passe", "Il empeche les virus", "Il sauvegarde les fichiers"], correct: 1, explanation: "Si votre laptop est vole, le chiffrement garantit que le voleur ne peut pas lire vos fichiers." },
      ],
    },
    "social-media-fraud": {
      lessons: [
        { title: "Arnaques sur les reseaux sociaux", content: ["WhatsApp, Facebook, Instagram : les attaquants creent de faux profils pour escroquer leurs cibles.", "Arnaques courantes en Afrique : faux concours, fausse loterie, offres d'emploi frauduleuses, romance scam."], warning: "Ne communiquez jamais vos codes Mobile Money ou informations bancaires via WhatsApp." },
        { title: "Fraude Mobile Money", content: ["Les attaquants appellent en se faisant passer pour l'operateur (Orange, MTN, Airtel) et demandent votre code PIN.", "Variantes : faux messages de gain, demande de confirmation de transaction, faux agents.", "Regle d'or : votre operateur ne vous demandera JAMAIS votre code PIN par telephone ou SMS."], tip: "En cas de doute sur une transaction Mobile Money, appelez directement votre operateur via le numero officiel." },
        { title: "Proteger son identite numerique", content: ["Limitez les informations personnelles partagees sur les reseaux (date de naissance, ville, employeur).", "Activez la double authentification sur tous vos comptes sociaux.", "Verifiez les parametres de confidentialite : qui peut voir vos publications, votre liste d'amis, votre numero ?"], tip: "Les attaquants utilisent vos informations publiques pour personnaliser leurs arnaques." },
      ],
      quiz: [
        { question: "Vous recevez un appel de votre operateur Mobile Money demandant votre code PIN. Que faites-vous ?", options: ["Je donne mon code PIN car c'est l'operateur", "Je refuse et raccroche — un operateur ne demande jamais le PIN", "Je donne un faux code", "Je leur demande de rappeler plus tard"], correct: 1, explanation: "Aucun operateur ne vous demandera jamais votre code PIN. C'est un indicateur immediat de fraude." },
        { question: "Un ami Facebook vous envoie un message demandant de l'argent via Mobile Money. Que faites-vous ?", options: ["J'envoie l'argent immediatement", "J'appelle cet ami sur son numero habituel pour verifier", "Je lui demande des details par Messenger", "Je signale le compte comme pirate"], correct: 1, explanation: "Les comptes pirates sont souvent utilises pour arnaquer les contacts. Verifiez toujours par telephone." },
        { question: "Quelle information ne devriez-vous PAS partager publiquement sur les reseaux sociaux ?", options: ["Vos photos de vacances (apres le retour)", "Votre date de naissance complete et votre employeur", "Votre opinion sur un film", "Un article de presse interessant"], correct: 1, explanation: "Date de naissance + employeur permettent aux attaquants de personnaliser des attaques ciblees." },
      ],
    },
  },
  en: {
    "phishing-101": {
      lessons: [
        { title: "What is phishing?", content: ["Phishing is an online scam where an attacker impersonates a trusted entity (bank, employer, government service) to steal your personal information.", "In Africa, attacks often target Mobile Money services, bank transfers, and internal business communications."], tip: "95% of successful cyberattacks begin with a phishing email." },
        { title: "Recognizing a phishing email", content: ["Warning signs include: suspicious sender address, artificial urgency, spelling mistakes, shortened or unfamiliar links.", "Always check the full email address of the sender, not just the display name."], warning: "Never click a link in an urgent email without verifying the sender through another channel." },
        { title: "What to do with a suspicious email?", content: ["1. Don't click any link or open any attachment.", "2. Verify the sender's identity by phone or in person.", "3. Report the email to your IT department.", "4. Delete the email from your inbox."], tip: "Your IT team would rather receive 10 false alerts than miss 1 real attack." },
      ],
      quiz: [
        { question: "You receive an email from your CEO requesting an urgent wire transfer. What do you do?", options: ["Process the transfer immediately", "Verify the email address and call the CEO", "Ignore the email", "Forward it to a colleague"], correct: 1, explanation: "Always verify through a different channel (phone, in person) before acting on an urgent email involving money." },
        { question: "What is the most reliable element to identify a phishing email?", options: ["The company logo", "The sender's full email address", "The professional layout", "The email signature"], correct: 1, explanation: "Logos and layouts are easy to copy. The sender's email address is the first indicator to check." },
        { question: "A colleague forwards you a suspicious email. What should you do?", options: ["Click the link to check if it's dangerous", "Report it to IT", "Reply to the original sender", "Archive it and do nothing"], correct: 1, explanation: "Always report suspicious emails to IT. Never click links to test them." },
      ],
    },
    "social-engineering": {
      lessons: [
        { title: "Social engineering explained", content: ["Social engineering exploits human psychology rather than technical vulnerabilities. The attacker manipulates your trust, fear, or eagerness.", "Common techniques: pretexting (fake identity), baiting (abandoned USB drive), quid pro quo (fake tech support)."], tip: "Humans are often the weakest link in the security chain." },
        { title: "Real-world business cases", content: ["An IT technician calls to fix a problem and asks for your credentials.", "A visitor claims to be a delivery person and plugs a USB drive into an unlocked PC.", "An email from management urgently requests the company's bank details for an audit."], warning: "A real IT technician never needs your password. If someone asks for it, it's an attack." },
        { title: "Protecting yourself daily", content: ["Apply the Verify before acting rule: confirm any sensitive request through a second channel.", "Lock your workstation when you leave it, even for 30 seconds.", "Never let a stranger access your systems without verified authorization."], tip: "A simple verification reflex can block 90% of social engineering attempts." },
      ],
      quiz: [
        { question: "Someone claims to be IT support and asks for your password by phone. What do you do?", options: ["I give my password since it's IT", "I refuse and contact IT myself", "I give an old password", "I ask their name and give it later"], correct: 1, explanation: "A real IT technician never needs your password. Contact the IT department yourself through official channels." },
        { question: "You find a USB drive in the company parking lot. What do you do?", options: ["I plug it into my PC to identify the owner", "I hand it to IT without plugging it in", "I throw it away", "I keep it for personal use"], correct: 1, explanation: "Abandoned USB drives are a classic attack vector. Hand it to IT for secure analysis." },
        { question: "What is the best defense against social engineering?", options: ["A good antivirus", "Verifying any sensitive request through a second channel", "Never talking to strangers", "Changing your password daily"], correct: 1, explanation: "Second-channel verification is the most effective defense against manipulation." },
      ],
    },
    "passwords-mfa": {
      lessons: [
        { title: "Creating a strong password", content: ["A good password is at least 12 characters and mixes uppercase, lowercase, numbers, and symbols.", "Effective technique: a passphrase. Example: MyDog@Eats3Apples! is much stronger than P@ss123."], tip: "A 12-character mixed password takes thousands of years to crack by brute force." },
        { title: "Multi-Factor Authentication (MFA)", content: ["MFA adds a security layer: even if your password is stolen, the attacker can't log in without the second factor.", "Types of MFA: SMS (acceptable), authenticator app (recommended), physical key (optimal)."], warning: "SMS-based MFA can be intercepted via SIM swapping, common in Africa. Prefer an app like Google Authenticator." },
        { title: "Password managers", content: ["Use a password manager (Bitwarden, 1Password) to store all your passwords. You only need to remember one master password.", "Never reuse the same password across multiple services."], tip: "A password manager is the most cost-effective security tool for a business." },
      ],
      quiz: [
        { question: "Which password is the most secure?", options: ["P@ssw0rd!", "MyDog@Eats3Apples!", "123456789", "admin2024"], correct: 1, explanation: "A long passphrase with special characters is much harder to crack than a short word with predictable substitutions." },
        { question: "Why is app-based MFA preferable to SMS?", options: ["It's faster", "SMS can be intercepted via SIM swapping", "The app is free", "SMS is expensive"], correct: 1, explanation: "SIM swapping allows an attacker to transfer your number to their SIM card and intercept SMS codes." },
        { question: "You use the same password for your work email and a shopping site. The site gets hacked. What's the risk?", options: ["Nothing, passwords are encrypted", "The attacker can access my work email", "Only my shopping account is compromised", "My antivirus protects me"], correct: 1, explanation: "Password reuse means a single breach compromises all accounts using that password." },
      ],
    },
    "fake-emails": {
      lessons: [
        { title: "Types of fraudulent emails", content: ["BEC (Business Email Compromise): the attacker impersonates the CEO or a supplier to request wire transfers.", "In Africa, wire transfer fraud and supplier scams are particularly common among SMBs."], warning: "BEC losses exceed $43 billion globally. A single mistake can bankrupt a company." },
        { title: "Analyzing a suspicious email", content: ["Check the full address (not just the display name). Hover over links WITHOUT clicking to see the real URL.", "Be wary of urgent requests, supplier bank detail changes, and unexpected attachments (.exe, .zip, .scr)."], tip: "A request to change a supplier's bank details should ALWAYS be verified by phone." },
        { title: "Reporting protocol", content: ["1. Don't reply or forward the email.", "2. Take a screenshot of the full email (headers if possible).", "3. Report immediately to IT/security through the dedicated channel.", "4. Warn colleagues if the campaign seems to target multiple people."] },
      ],
      quiz: [
        { question: "A regular supplier sends an email asking to change their bank details. What do you do?", options: ["I update the bank details in the system", "I call the supplier at their usual number to verify", "I reply to the email to confirm", "I wait for the next invoice to verify"], correct: 1, explanation: "Bank detail change fraud is very common. ALWAYS verify by phone using the number you already have." },
        { question: "How can you check a link in an email safely?", options: ["By clicking it quickly", "By hovering over the link to see the URL", "By copying it into Google", "By asking a colleague to click"], correct: 1, explanation: "Hovering over a link reveals the real URL without triggering the link." },
        { question: "Which type of attachment is the most dangerous?", options: ["An invoice PDF (.pdf)", "An .exe or .scr file", "An image (.jpg)", "A Word document (.docx)"], correct: 1, explanation: ".exe and .scr files are executables that can install malware." },
      ],
    },
    "device-security": {
      lessons: [
        { title: "Physical threats to your devices", content: ["Attacks don't only come from the internet. A malicious USB drive, public Wi-Fi, or shoulder surfing are real threats.", "In the African context, cybercafes, hotels, and coworking spaces are high-risk zones."], warning: "NEVER plug an unknown USB drive into your work computer." },
        { title: "Securing your workstation", content: ["Lock your screen whenever you leave your desk (Win+L or Cmd+Ctrl+Q).", "Enable full disk encryption (BitLocker on Windows, FileVault on Mac).", "Keep your system and software up to date."], tip: "An unlocked computer for 30 seconds is enough to install a keylogger." },
        { title: "Public Wi-Fi and VPN", content: ["Public Wi-Fi (hotels, cafes, airports) is not encrypted. Everything you transmit can be intercepted.", "Always use a VPN on public networks."], tip: "If you don't have a VPN, use your mobile hotspot instead of public Wi-Fi for sensitive tasks." },
      ],
      quiz: [
        { question: "You're traveling and need to send a wire transfer. The hotel Wi-Fi is available. What do you do?", options: ["I use the Wi-Fi directly", "I use a VPN or my mobile hotspot", "I wait until I'm back at the office", "I ask the front desk for the Wi-Fi password"], correct: 1, explanation: "Hotel Wi-Fi can be intercepted. A VPN or your encrypted mobile connection is safer for sensitive operations." },
        { question: "What's the first thing to do when leaving your desk, even briefly?", options: ["Turn off the screen", "Lock the session (Win+L / Cmd+Ctrl+Q)", "Close the office door", "Put the PC to sleep"], correct: 1, explanation: "Locking the session prevents anyone from accessing your data and systems in your absence." },
        { question: "Why is disk encryption important?", options: ["It speeds up the computer", "If stolen, data remains unreadable without the password", "It prevents viruses", "It backs up files"], correct: 1, explanation: "If your laptop is stolen, encryption ensures the thief cannot read your professional files." },
      ],
    },
    "social-media-fraud": {
      lessons: [
        { title: "Social media scams", content: ["WhatsApp, Facebook, Instagram: attackers create fake profiles to scam their targets.", "Common scams in Africa: fake contests, fake lotteries, fraudulent job offers, romance scams."], warning: "Never share your Mobile Money codes or bank information via WhatsApp, even to a friend." },
        { title: "Mobile Money fraud", content: ["Attackers call pretending to be the operator (Orange, MTN, Airtel) and ask for your PIN code.", "Variants: fake winning messages, transaction confirmation requests, fake agents.", "Golden rule: your operator will NEVER ask for your PIN or secret code by phone or SMS."], tip: "If in doubt about a Mobile Money transaction, call your operator directly using the official number." },
        { title: "Protecting your digital identity", content: ["Limit personal information shared on social media (date of birth, city, employer).", "Enable two-factor authentication on all your social accounts.", "Check privacy settings: who can see your posts, friends list, phone number?"], tip: "Attackers use your public information to personalize their scams and make them credible." },
      ],
      quiz: [
        { question: "You receive a call from your Mobile Money operator asking for your PIN code for an update. What do you do?", options: ["I give my PIN since it's the operator", "I refuse and hang up — an operator never asks for your PIN", "I give a fake code", "I ask them to call back later"], correct: 1, explanation: "No operator will ever ask for your PIN code. It's an immediate indicator of fraud." },
        { question: "A Facebook friend sends you a message asking for money via Mobile Money for a medical emergency. What do you do?", options: ["I send the money immediately", "I call this friend at their usual number to verify", "I ask for details via Messenger", "I report the account as hacked"], correct: 1, explanation: "Hacked accounts are often used to scam contacts. Always verify by phone or in person." },
        { question: "Which information should you NOT share publicly on social media?", options: ["Your vacation photos (after returning)", "Your full date of birth and employer", "Your opinion on a movie", "An interesting news article"], correct: 1, explanation: "Date of birth + employer allow attackers to personalize targeted attacks (spear phishing, identity theft)." },
      ],
    },
  },
};

const defaultContentByLocale: Record<string, { lessons: Lesson[]; quiz: Quiz[] }> = {
  fr: {
    lessons: [
      { title: "Introduction", content: ["Ce module vous apprend a identifier et prevenir les cybermenaces les plus courantes dans votre environnement professionnel."], tip: "La sensibilisation est la premiere ligne de defense contre les cyberattaques." },
      { title: "Bonnes pratiques", content: ["Restez vigilant face aux demandes inhabituelles.", "Verifiez toujours l'identite de votre interlocuteur avant de partager des informations sensibles."] },
    ],
    quiz: [
      { question: "Quelle est la meilleure pratique face a une demande suspecte ?", options: ["Agir vite pour ne pas retarder le travail", "Verifier par un second canal avant d'agir", "Ignorer completement", "Repondre pour demander plus d'informations"], correct: 1, explanation: "La verification par un second canal est toujours la meilleure approche face a une demande suspecte." },
    ],
  },
  en: {
    lessons: [
      { title: "Introduction", content: ["This module teaches you to identify and prevent the most common cyber threats in your professional environment."], tip: "Awareness is the first line of defense against cyberattacks." },
      { title: "Best practices", content: ["Stay vigilant against unusual requests.", "Always verify the identity of your contact before sharing sensitive information."] },
    ],
    quiz: [
      { question: "What is the best practice when facing a suspicious request?", options: ["Act quickly to avoid delays", "Verify through a second channel before acting", "Ignore completely", "Reply to ask for more information"], correct: 1, explanation: "Second-channel verification is always the best approach for suspicious requests." },
    ],
  },
};

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  durationMinutes: number;
  badgeIcon: string | null;
  badgeName: string | null;
  progress: { status: string; progressPercent: number; quizScore: number | null };
}

interface TrainingResponse {
  modules: TrainingModule[];
}

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const { t, locale } = useTranslation();
  const { data, loading } = useApi<TrainingResponse>("/api/training");
  const content = moduleContentByLocale[locale]?.[moduleId] || defaultContentByLocale[locale] || defaultContentByLocale.fr;

  const [phase, setPhase] = useState<"lessons" | "quiz" | "results">("lessons");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const currentModule = data?.modules.find((m) => m.id === moduleId);

  if (loading) {
    return (
      <div>
        <Header title={t("common.loading")} />
        <div className="space-y-6 p-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
            </div>
            <div className="space-y-4">
              <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentModule) {
    return (
      <div>
        <Header title={t("training.moduleNotFound")} />
        <div className="p-6">
          <Link href="/dashboard/training">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("training.backToTraining")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyLabel = currentModule.difficulty === "BEGINNER" ? t("status.beginner") : currentModule.difficulty === "INTERMEDIATE" ? t("status.intermediate") : t("status.advanced");
  const durationLabel = currentModule.durationMinutes >= 60 ? `${Math.floor(currentModule.durationMinutes / 60)}h${currentModule.durationMinutes % 60 > 0 ? currentModule.durationMinutes % 60 + "min" : ""}` : `${currentModule.durationMinutes} min`;

  const handleCompleteLesson = () => {
    const newCompleted = completedLessons.includes(currentLesson)
      ? completedLessons
      : [...completedLessons, currentLesson];
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons(newCompleted);
    }
    // Envoyer la progression partielle
    const percent = Math.round((newCompleted.length / (content.lessons.length + content.quiz.length)) * 100);
    fetch("/api/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, progressPercent: Math.min(percent, 99) }),
    }).catch(() => {});

    if (currentLesson < content.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === content.quiz[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < content.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setPhase("results");
      // Envoyer la progression au serveur
      const finalScore = score + (selectedAnswer === content.quiz[currentQuestion].correct ? 1 : 0);
      fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          progressPercent: 100,
          quizScore: Math.round((finalScore / content.quiz.length) * 100),
        }),
      })
        .then((res) => { if (res.ok) toast.success(t("training.progressSaved")); })
        .catch(() => {});
    }
  };

  const handleRestart = () => {
    setPhase("lessons");
    setCurrentLesson(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setCompletedLessons([]);
  };

  const totalProgress =
    phase === "results"
      ? 100
      : phase === "quiz"
      ? Math.round(((content.lessons.length + currentQuestion) / (content.lessons.length + content.quiz.length)) * 100)
      : Math.round((completedLessons.length / (content.lessons.length + content.quiz.length)) * 100);

  return (
    <div>
      <Header title={currentModule.title} />
      <div className="space-y-6 p-6">
        <Link href="/dashboard/training">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("training.backToTraining")}
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <FadeIn>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{currentModule.badgeIcon || "📚"}</span>
                    <div>
                      <h2 className="text-xl font-bold">{currentModule.title}</h2>
                      <p className="text-sm text-muted-foreground">{currentModule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">{currentModule.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {durationLabel}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <AnimatePresence mode="wait">
              {phase === "lessons" && (
                <motion.div key="lesson" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          {t("training.lesson")} {currentLesson + 1}/{content.lessons.length}
                        </CardTitle>
                        <Badge variant="outline" className="border-rht-violet/30 text-rht-violet-light">
                          {t("training.learning")}
                        </Badge>
                      </div>
                      <Progress
                        value={((currentLesson + 1) / content.lessons.length) * 100}
                        className="mt-2 h-2"
                      />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="text-lg font-semibold">{content.lessons[currentLesson].title}</h3>
                      <div className="space-y-3">
                        {content.lessons[currentLesson].content.map((paragraph, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="text-sm leading-relaxed text-muted-foreground"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>

                      {content.lessons[currentLesson].tip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start gap-3 rounded-xl bg-cyber-green/5 border border-cyber-green/20 p-4"
                        >
                          <Lightbulb className="h-5 w-5 shrink-0 text-cyber-green" />
                          <p className="text-sm text-cyber-green">{content.lessons[currentLesson].tip}</p>
                        </motion.div>
                      )}

                      {content.lessons[currentLesson].warning && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start gap-3 rounded-xl bg-cyber-red/5 border border-cyber-red/20 p-4"
                        >
                          <AlertTriangle className="h-5 w-5 shrink-0 text-cyber-red" />
                          <p className="text-sm text-cyber-red">{content.lessons[currentLesson].warning}</p>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={currentLesson === 0}
                          onClick={() => setCurrentLesson(currentLesson - 1)}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          {t("training.previous")}
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                          onClick={handleCompleteLesson}
                        >
                          {currentLesson < content.lessons.length - 1 ? (
                            <>
                              {t("training.next")}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              {t("training.startQuiz")}
                              <Play className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {phase === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          {t("training.question")} {currentQuestion + 1}/{content.quiz.length}
                        </CardTitle>
                        <Badge variant="outline" className="border-rht-orange/30 text-rht-orange">
                          {t("training.interactiveQuiz")}
                        </Badge>
                      </div>
                      <Progress
                        value={((currentQuestion + 1) / content.quiz.length) * 100}
                        className="mt-2 h-2"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="mb-5 text-base font-medium">
                        {content.quiz[currentQuestion].question}
                      </p>
                      <div className="space-y-2">
                        {content.quiz[currentQuestion].options.map((option, index) => {
                          let optionClass = "hover:bg-accent";
                          if (answered) {
                            if (index === content.quiz[currentQuestion].correct) {
                              optionClass = "border-cyber-green bg-cyber-green/10 text-cyber-green";
                            } else if (index === selectedAnswer) {
                              optionClass = "border-cyber-red bg-cyber-red/10 text-cyber-red";
                            } else {
                              optionClass = "opacity-50";
                            }
                          } else if (selectedAnswer === index) {
                            optionClass = "border-rht-violet bg-rht-violet/10 text-rht-violet-light";
                          }

                          return (
                            <motion.button
                              key={index}
                              whileHover={!answered ? { scale: 1.01 } : {}}
                              whileTap={!answered ? { scale: 0.99 } : {}}
                              onClick={() => handleAnswer(index)}
                              disabled={answered}
                              className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${optionClass}`}
                            >
                              <span className="mr-2 font-semibold text-muted-foreground">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option}
                              {answered && index === content.quiz[currentQuestion].correct && (
                                <CheckCircle className="ml-auto inline h-4 w-4" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {answered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 rounded-xl bg-accent/50 p-4"
                        >
                          <p className="text-xs font-medium text-muted-foreground">{t("training.explanation")}</p>
                          <p className="mt-1 text-sm">{content.quiz[currentQuestion].explanation}</p>
                        </motion.div>
                      )}

                      <Button
                        className="mt-5 w-full bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                        disabled={!answered}
                        onClick={handleNextQuestion}
                      >
                        {currentQuestion < content.quiz.length - 1 ? t("training.nextQuestion") : t("training.viewResults")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {phase === "results" && (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card>
                    <CardContent className="p-8 text-center">
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Trophy className="mx-auto mb-4 h-16 w-16 text-rht-orange" />
                      </motion.div>
                      <h3 className="mb-2 text-2xl font-bold">{t("training.moduleComplete")}</h3>
                      <p className="mb-2 text-lg">
                        {t("training.quizScore")}{" "}
                        <span className="font-bold text-rht-violet-light">
                          {score}/{content.quiz.length}
                        </span>
                      </p>
                      <p className="mb-6 text-sm text-muted-foreground">
                        {score === content.quiz.length
                          ? t("training.resultPerfect")
                          : score >= content.quiz.length * 0.66
                          ? t("training.resultGood")
                          : t("training.resultRetry")}
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={handleRestart}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {t("training.restart")}
                        </Button>
                        <Link href="/dashboard/training">
                          <Button className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                            {t("training.backToTraining")}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("training.progression")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("training.completedLabel")}</span>
                      <span className="font-semibold">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.25}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("training.summary")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.lessons.map((lesson, i) => (
                      <button
                        key={i}
                        onClick={() => { setPhase("lessons"); setCurrentLesson(i); }}
                        className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs transition-colors hover:bg-accent"
                      >
                        {completedLessons.includes(i) ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-cyber-green" />
                        ) : phase === "lessons" && currentLesson === i ? (
                          <Play className="h-4 w-4 shrink-0 text-rht-violet-light" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                        )}
                        <span className={completedLessons.includes(i) ? "text-muted-foreground" : ""}>{lesson.title}</span>
                      </button>
                    ))}
                    <div className="my-2 border-t" />
                    <div className="flex items-center gap-2 rounded-lg p-2 text-xs">
                      {phase === "results" ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-cyber-green" />
                      ) : phase === "quiz" ? (
                        <Play className="h-4 w-4 shrink-0 text-rht-orange" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                      )}
                      <span>{t("training.finalQuiz")} ({content.quiz.length} {t("training.questions")})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("training.info")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("training.difficulty")}</span>
                    <span className="font-medium">{difficultyLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("training.durationLabel")}</span>
                    <span className="font-medium">{durationLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("training.lessonsLabel")}</span>
                    <span className="font-medium">{content.lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("training.questionsLabel")}</span>
                    <span className="font-medium">{content.quiz.length}</span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const moduleContent: Record<string, { lessons: Lesson[]; quiz: Quiz[] }> = {
  "phishing-101": {
    lessons: [
      {
        title: "Qu'est-ce que le phishing ?",
        content: [
          "Le phishing est une technique d'escroquerie en ligne où un attaquant se fait passer pour une entité de confiance (banque, employeur, service public) afin de voler vos informations personnelles.",
          "En Afrique, les attaques ciblent souvent les services Mobile Money, les virements bancaires et les communications internes d'entreprise.",
        ],
        tip: "95% des cyberattaques réussies commencent par un email de phishing.",
      },
      {
        title: "Reconnaître un email de phishing",
        content: [
          "Les signes d'alerte incluent : adresse d'expéditeur suspecte, urgence artificielle, fautes d'orthographe, liens raccourcis ou non reconnus.",
          "Vérifiez toujours l'adresse email complète de l'expéditeur, pas seulement le nom affiché. Un email de « Direction RH » peut venir de hacker@gmail.com.",
        ],
        warning: "Ne cliquez jamais sur un lien dans un email urgent sans vérifier l'expéditeur par un autre canal.",
      },
      {
        title: "Que faire face à un email suspect ?",
        content: [
          "1. Ne cliquez sur aucun lien et n'ouvrez aucune pièce jointe.",
          "2. Vérifiez l'identité de l'expéditeur par téléphone ou en personne.",
          "3. Signalez l'email à votre service informatique.",
          "4. Supprimez l'email de votre boîte de réception.",
        ],
        tip: "Votre service IT préfère recevoir 10 fausses alertes qu'ignorer 1 vraie attaque.",
      },
    ],
    quiz: [
      {
        question: "Vous recevez un email de votre « PDG » demandant un virement urgent. Que faites-vous ?",
        options: ["J'effectue le virement immédiatement", "Je vérifie l'adresse email et contacte le PDG par téléphone", "J'ignore l'email", "Je le transfère à un collègue"],
        correct: 1,
        explanation: "Toujours vérifier par un canal différent (téléphone, en personne) avant d'agir sur un email urgent impliquant de l'argent.",
      },
      {
        question: "Quel élément est le plus fiable pour identifier un email de phishing ?",
        options: ["Le logo de l'entreprise", "L'adresse email complète de l'expéditeur", "La mise en page professionnelle", "La signature en bas de l'email"],
        correct: 1,
        explanation: "Les logos et mises en page sont faciles à copier. L'adresse email de l'expéditeur est le premier indicateur à vérifier.",
      },
      {
        question: "Un collègue vous transfère un email suspect. Que devez-vous faire ?",
        options: ["Cliquer sur le lien pour vérifier s'il est dangereux", "Le signaler au service IT", "Répondre à l'expéditeur original pour demander des explications", "L'archiver sans rien faire"],
        correct: 1,
        explanation: "Signalez toujours les emails suspects au service IT. Ne cliquez jamais sur les liens pour « tester » — c'est exactement ce que l'attaquant espère.",
      },
    ],
  },
  "social-engineering": {
    lessons: [
      {
        title: "L'ingénierie sociale expliquée",
        content: [
          "L'ingénierie sociale exploite la psychologie humaine plutôt que les failles techniques. L'attaquant manipule votre confiance, votre peur ou votre empressement.",
          "Techniques courantes : prétexte (fausse identité), appât (clé USB abandonnée), quid pro quo (fausse aide technique).",
        ],
        tip: "L'humain est souvent le maillon le plus faible de la chaîne de sécurité.",
      },
      {
        title: "Cas pratiques en entreprise",
        content: [
          "Un « technicien IT » vous appelle pour résoudre un problème et demande vos identifiants.",
          "Un visiteur se présente comme livreur et branche une clé USB dans un PC non verrouillé.",
          "Un email de « la direction » demande d'urgence les coordonnées bancaires de l'entreprise pour un audit.",
        ],
        warning: "Un vrai technicien IT n'a jamais besoin de votre mot de passe. Si on vous le demande, c'est une attaque.",
      },
      {
        title: "Se protéger au quotidien",
        content: [
          "Appliquez la règle du « Vérifier avant d'agir » : confirmez toute demande sensible par un second canal.",
          "Verrouillez votre poste quand vous le quittez, même 30 secondes.",
          "Ne laissez jamais un inconnu accéder à vos systèmes sans autorisation vérifiée de votre hiérarchie.",
        ],
        tip: "Un simple réflexe de vérification peut bloquer 90% des tentatives d'ingénierie sociale.",
      },
    ],
    quiz: [
      {
        question: "Quelqu'un se présente comme technicien IT et demande votre mot de passe par téléphone. Que faites-vous ?",
        options: ["Je donne mon mot de passe car c'est l'IT", "Je refuse et contacte moi-même le service IT", "Je donne un ancien mot de passe", "Je demande son nom et je le lui donne ensuite"],
        correct: 1,
        explanation: "Un vrai technicien IT n'a jamais besoin de votre mot de passe. Contactez vous-même le service via les canaux officiels.",
      },
      {
        question: "Vous trouvez une clé USB dans le parking de l'entreprise. Que faites-vous ?",
        options: ["Je la branche sur mon PC pour identifier le propriétaire", "Je la remets au service IT sans la brancher", "Je la jette", "Je la garde pour usage personnel"],
        correct: 1,
        explanation: "Les clés USB abandonnées sont un vecteur d'attaque classique. Remettez-la au service IT qui l'analysera en environnement sécurisé.",
      },
      {
        question: "Quelle est la meilleure défense contre l'ingénierie sociale ?",
        options: ["Un bon antivirus", "Vérifier toute demande sensible par un second canal", "Ne jamais parler à des inconnus", "Changer son mot de passe tous les jours"],
        correct: 1,
        explanation: "La vérification par un second canal (téléphone, en personne) est la parade la plus efficace contre la manipulation.",
      },
    ],
  },
  "passwords-mfa": {
    lessons: [
      {
        title: "Créer un mot de passe robuste",
        content: [
          "Un bon mot de passe fait au moins 12 caractères et mélange majuscules, minuscules, chiffres et symboles.",
          "Technique efficace : une phrase de passe. Ex: « MonChien@Mange3Pommes! » est bien plus solide que « P@ss123 ».",
        ],
        tip: "Un mot de passe de 12 caractères mixtes prend des milliers d'années à craquer par force brute.",
      },
      {
        title: "L'authentification multi-facteurs (MFA)",
        content: [
          "La MFA ajoute une couche de sécurité : même si votre mot de passe est volé, l'attaquant ne peut pas se connecter sans le second facteur.",
          "Types de MFA : SMS (acceptable), application d'authentification (recommandé), clé physique (optimal).",
        ],
        warning: "La MFA par SMS peut être interceptée via SIM swapping, courant en Afrique. Préférez une app comme Google Authenticator.",
      },
      {
        title: "Gestionnaire de mots de passe",
        content: [
          "Utilisez un gestionnaire (Bitwarden, 1Password) pour stocker tous vos mots de passe. Vous n'avez qu'un seul mot de passe maître à retenir.",
          "Ne réutilisez jamais le même mot de passe sur plusieurs services. Si un site est piraté, tous vos comptes seraient compromis.",
        ],
        tip: "Un gestionnaire de mots de passe est l'outil de sécurité le plus rentable pour une entreprise.",
      },
    ],
    quiz: [
      {
        question: "Quel mot de passe est le plus sécurisé ?",
        options: ["P@ssw0rd!", "MonChien@Mange3Pommes!", "123456789", "admin2024"],
        correct: 1,
        explanation: "Une phrase de passe longue avec des caractères spéciaux est beaucoup plus difficile à craquer qu'un mot court avec des substitutions prévisibles.",
      },
      {
        question: "Pourquoi la MFA par application est-elle préférable au SMS ?",
        options: ["C'est plus rapide", "Le SMS peut être intercepté via SIM swapping", "L'app est gratuite", "Le SMS coûte cher"],
        correct: 1,
        explanation: "Le SIM swapping permet à un attaquant de transférer votre numéro sur sa carte SIM et d'intercepter les codes SMS.",
      },
      {
        question: "Vous utilisez le même mot de passe pour votre email pro et un site de shopping. Le site est piraté. Que risquez-vous ?",
        options: ["Rien, les mots de passe sont chiffrés", "L'attaquant peut accéder à mon email professionnel", "Seulement mon compte shopping est compromis", "Mon antivirus me protège"],
        correct: 1,
        explanation: "La réutilisation de mots de passe signifie qu'un seul piratage compromet tous vos comptes utilisant ce mot de passe.",
      },
    ],
  },
  "fake-emails": {
    lessons: [
      {
        title: "Les types d'emails frauduleux",
        content: [
          "BEC (Business Email Compromise) : l'attaquant usurpe l'identité du PDG ou d'un fournisseur pour demander des virements.",
          "En Afrique, les fraudes au virement et les arnaques « fournisseur » sont particulièrement répandues dans les PME.",
        ],
        warning: "Les pertes dues au BEC dépassent 43 milliards de dollars dans le monde. Une seule erreur peut mettre une entreprise en faillite.",
      },
      {
        title: "Analyser un email suspect",
        content: [
          "Vérifiez l'adresse complète (pas juste le nom affiché). Survolez les liens SANS cliquer pour voir l'URL réelle.",
          "Méfiez-vous des demandes urgentes, des changements de RIB fournisseur, et des pièces jointes inattendues (.exe, .zip, .scr).",
        ],
        tip: "Une demande de changement de coordonnées bancaires d'un fournisseur doit TOUJOURS être vérifiée par téléphone au numéro habituel.",
      },
      {
        title: "Protocole de signalement",
        content: [
          "1. Ne répondez pas et ne transférez pas l'email.",
          "2. Capturez une capture d'écran de l'email complet (en-têtes inclus si possible).",
          "3. Signalez immédiatement au service IT/sécurité via le canal dédié.",
          "4. Prévenez vos collègues si la campagne semble cibler plusieurs personnes.",
        ],
      },
    ],
    quiz: [
      {
        question: "Un fournisseur habituel vous envoie un email demandant de changer son RIB. Que faites-vous ?",
        options: ["Je mets à jour le RIB dans le système", "J'appelle le fournisseur à son numéro habituel pour vérifier", "Je réponds à l'email pour confirmer", "J'attends la prochaine facture pour vérifier"],
        correct: 1,
        explanation: "Les fraudes au changement de RIB sont très courantes. Vérifiez TOUJOURS par téléphone au numéro que vous avez déjà en base (pas celui dans l'email).",
      },
      {
        question: "Comment vérifier un lien dans un email sans danger ?",
        options: ["En cliquant dessus rapidement", "En survolant le lien avec la souris pour voir l'URL", "En le copiant dans Google", "En demandant à un collègue de cliquer"],
        correct: 1,
        explanation: "Survoler un lien révèle l'URL réelle en bas de l'écran ou dans une info-bulle, sans déclencher le lien.",
      },
      {
        question: "Quel type de pièce jointe est le plus dangereux ?",
        options: ["Un PDF de facture (.pdf)", "Un fichier .exe ou .scr", "Une image (.jpg)", "Un document Word (.docx)"],
        correct: 1,
        explanation: "Les fichiers .exe et .scr sont des exécutables qui peuvent installer des malwares. Cependant, même les .docx avec macros peuvent être dangereux.",
      },
    ],
  },
  "device-security": {
    lessons: [
      {
        title: "Menaces physiques sur vos appareils",
        content: [
          "Les attaques ne viennent pas que d'Internet. Une clé USB malveillante, un Wi-Fi public ou un regard par-dessus l'épaule sont des menaces réelles.",
          "En contexte africain, les cybercafés, hôtels et espaces de coworking sont des zones à risque élevé.",
        ],
        warning: "Ne branchez JAMAIS une clé USB d'origine inconnue sur votre ordinateur professionnel.",
      },
      {
        title: "Sécuriser votre poste de travail",
        content: [
          "Verrouillez votre écran dès que vous quittez votre poste (Win+L ou Cmd+Ctrl+Q).",
          "Activez le chiffrement complet du disque (BitLocker sur Windows, FileVault sur Mac).",
          "Gardez votre système et vos logiciels à jour — les mises à jour corrigent des failles de sécurité.",
        ],
        tip: "Un ordinateur non verrouillé pendant 30 secondes suffit pour installer un keylogger.",
      },
      {
        title: "Wi-Fi public et VPN",
        content: [
          "Le Wi-Fi public (hôtels, cafés, aéroports) n'est pas chiffré. Tout ce que vous transmettez peut être intercepté.",
          "Utilisez toujours un VPN sur les réseaux publics. Le VPN chiffre votre trafic et le rend illisible pour un attaquant.",
        ],
        tip: "Si vous n'avez pas de VPN, utilisez votre partage de connexion mobile plutôt que le Wi-Fi public pour des tâches sensibles.",
      },
    ],
    quiz: [
      {
        question: "Vous êtes en déplacement et devez envoyer un virement. Le Wi-Fi de l'hôtel est disponible. Que faites-vous ?",
        options: ["J'utilise le Wi-Fi directement", "J'utilise un VPN ou mon partage de connexion mobile", "J'attends d'être au bureau", "Je demande le mot de passe Wi-Fi à la réception"],
        correct: 1,
        explanation: "Le Wi-Fi d'hôtel peut être intercepté. Un VPN ou votre connexion mobile chiffrée est plus sûr pour les opérations sensibles.",
      },
      {
        question: "Quelle est la première action à faire en quittant votre bureau, même brièvement ?",
        options: ["Éteindre l'écran", "Verrouiller la session (Win+L / Cmd+Ctrl+Q)", "Fermer la porte du bureau", "Mettre le PC en veille"],
        correct: 1,
        explanation: "Verrouiller la session empêche toute personne d'accéder à vos données et systèmes en votre absence.",
      },
      {
        question: "Pourquoi le chiffrement du disque est-il important ?",
        options: ["Il accélère l'ordinateur", "En cas de vol, les données restent illisibles sans le mot de passe", "Il empêche les virus", "Il sauvegarde les fichiers"],
        correct: 1,
        explanation: "Si votre laptop est volé, le chiffrement garantit que le voleur ne peut pas lire vos fichiers professionnels.",
      },
    ],
  },
  "social-media-fraud": {
    lessons: [
      {
        title: "Arnaques sur les réseaux sociaux",
        content: [
          "WhatsApp, Facebook, Instagram : les attaquants créent de faux profils pour escroquer leurs cibles.",
          "Arnaques courantes en Afrique : faux concours, fausse loterie, offres d'emploi frauduleuses, romantique scam.",
        ],
        warning: "Ne communiquez jamais vos codes Mobile Money ou informations bancaires via WhatsApp, même à un « ami ».",
      },
      {
        title: "Fraude Mobile Money",
        content: [
          "Les attaquants appellent en se faisant passer pour l'opérateur (Orange, MTN, Airtel) et demandent votre code PIN.",
          "Variantes : faux messages de gain, demande de « confirmation » de transaction, faux agents.",
          "Règle d'or : votre opérateur ne vous demandera JAMAIS votre code PIN ou code secret par téléphone ou SMS.",
        ],
        tip: "En cas de doute sur une transaction Mobile Money, appelez directement votre opérateur via le numéro officiel.",
      },
      {
        title: "Protéger son identité numérique",
        content: [
          "Limitez les informations personnelles partagées sur les réseaux (date de naissance, ville, employeur).",
          "Activez la double authentification sur tous vos comptes sociaux.",
          "Vérifiez les paramètres de confidentialité : qui peut voir vos publications, votre liste d'amis, votre numéro ?",
        ],
        tip: "Les attaquants utilisent vos informations publiques pour personnaliser leurs arnaques et les rendre crédibles.",
      },
    ],
    quiz: [
      {
        question: "Vous recevez un appel de « votre opérateur Mobile Money » demandant votre code PIN pour une mise à jour. Que faites-vous ?",
        options: ["Je donne mon code PIN car c'est l'opérateur", "Je refuse et raccroche — un opérateur ne demande jamais le PIN", "Je donne un faux code", "Je leur demande de rappeler plus tard"],
        correct: 1,
        explanation: "Aucun opérateur ne vous demandera jamais votre code PIN. C'est un indicateur immédiat de fraude.",
      },
      {
        question: "Un « ami » Facebook vous envoie un message demandant de l'argent via Mobile Money pour une urgence médicale. Que faites-vous ?",
        options: ["J'envoie l'argent immédiatement", "J'appelle cet ami sur son numéro habituel pour vérifier", "Je lui demande des détails par Messenger", "Je signale le compte comme piraté sans vérifier"],
        correct: 1,
        explanation: "Les comptes piratés sont souvent utilisés pour arnaquer les contacts. Vérifiez toujours par téléphone ou en personne.",
      },
      {
        question: "Quelle information ne devriez-vous PAS partager publiquement sur les réseaux sociaux ?",
        options: ["Vos photos de vacances (après le retour)", "Votre date de naissance complète et votre employeur", "Votre opinion sur un film", "Un article de presse intéressant"],
        correct: 1,
        explanation: "Date de naissance + employeur permettent aux attaquants de personnaliser des attaques ciblées (spear phishing, usurpation d'identité).",
      },
    ],
  },
};

const defaultContent: { lessons: Lesson[]; quiz: Quiz[] } = {
  lessons: [
    {
      title: "Introduction",
      content: ["Ce module vous apprend à identifier et prévenir les cybermenaces les plus courantes dans votre environnement professionnel."],
      tip: "La sensibilisation est la première ligne de défense contre les cyberattaques.",
    },
    {
      title: "Bonnes pratiques",
      content: ["Restez vigilant face aux demandes inhabituelles.", "Vérifiez toujours l'identité de votre interlocuteur avant de partager des informations sensibles."],
    },
  ],
  quiz: [
    {
      question: "Quelle est la meilleure pratique face à une demande suspecte ?",
      options: ["Agir vite pour ne pas retarder le travail", "Vérifier par un second canal avant d'agir", "Ignorer complètement", "Répondre pour demander plus d'informations"],
      correct: 1,
      explanation: "La vérification par un second canal est toujours la meilleure approche face à une demande suspecte.",
    },
  ],
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
  const { data, loading } = useApi<TrainingResponse>("/api/training");
  const content = moduleContent[moduleId] || defaultContent;

  const [phase, setPhase] = useState<"lessons" | "quiz" | "results">("lessons");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const module = data?.modules.find((m) => m.id === moduleId);

  if (loading) {
    return (
      <div>
        <Header title="Chargement..." />
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

  if (!module) {
    return (
      <div>
        <Header title="Module introuvable" />
        <div className="p-6">
          <Link href="/dashboard/training">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux formations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyLabel = module.difficulty === "BEGINNER" ? "Débutant" : module.difficulty === "INTERMEDIATE" ? "Intermédiaire" : "Avancé";
  const durationLabel = module.durationMinutes >= 60 ? `${Math.floor(module.durationMinutes / 60)}h${module.durationMinutes % 60 > 0 ? module.durationMinutes % 60 + "min" : ""}` : `${module.durationMinutes} min`;

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
        .then((res) => { if (res.ok) toast.success("Progression enregistrée !"); })
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
      <Header title={module.title} />
      <div className="space-y-6 p-6">
        <Link href="/dashboard/training">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <FadeIn>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{module.badgeIcon || "📚"}</span>
                    <div>
                      <h2 className="text-xl font-bold">{module.title}</h2>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge className="border-0 bg-rht-violet/10 text-rht-violet-light">{module.category}</Badge>
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
                          Leçon {currentLesson + 1}/{content.lessons.length}
                        </CardTitle>
                        <Badge variant="outline" className="border-rht-violet/30 text-rht-violet-light">
                          Apprentissage
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
                          Précédent
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                          onClick={handleCompleteLesson}
                        >
                          {currentLesson < content.lessons.length - 1 ? (
                            <>
                              Suivant
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Passer au Quiz
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
                          Question {currentQuestion + 1}/{content.quiz.length}
                        </CardTitle>
                        <Badge variant="outline" className="border-rht-orange/30 text-rht-orange">
                          Quiz interactif
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
                          <p className="text-xs font-medium text-muted-foreground">Explication</p>
                          <p className="mt-1 text-sm">{content.quiz[currentQuestion].explanation}</p>
                        </motion.div>
                      )}

                      <Button
                        className="mt-5 w-full bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90"
                        disabled={!answered}
                        onClick={handleNextQuestion}
                      >
                        {currentQuestion < content.quiz.length - 1 ? "Question suivante" : "Voir les résultats"}
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
                      <h3 className="mb-2 text-2xl font-bold">Module terminé !</h3>
                      <p className="mb-2 text-lg">
                        Score au quiz :{" "}
                        <span className="font-bold text-rht-violet-light">
                          {score}/{content.quiz.length}
                        </span>
                      </p>
                      <p className="mb-6 text-sm text-muted-foreground">
                        {score === content.quiz.length
                          ? "Excellent ! Vous maîtrisez parfaitement ce sujet."
                          : score >= content.quiz.length * 0.66
                          ? "Bon travail ! Vous avez bien compris les concepts clés."
                          : "Continuez à vous former. Refaites le module pour améliorer votre score."}
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={handleRestart}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Recommencer
                        </Button>
                        <Link href="/dashboard/training">
                          <Button className="bg-gradient-to-r from-rht-violet to-rht-violet-light text-white hover:opacity-90">
                            Retour aux formations
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
                  <CardTitle className="text-sm">Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Complété</span>
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
                  <CardTitle className="text-sm">Sommaire</CardTitle>
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
                      <span>Quiz final ({content.quiz.length} questions)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulté</span>
                    <span className="font-medium">{difficultyLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium">{durationLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Leçons</span>
                    <span className="font-medium">{content.lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions</span>
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

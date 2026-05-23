import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail, sessionUser } from "@/lib/api-auth";
import { Resend } from "resend";
import { EMAIL_FROM } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Templates d'emails de simulation ─────────────────────────────
const phishingTemplates: Record<string, { subject: string; html: (name: string, link: string) => string }> = {
  mobile_money: {
    subject: "⚠️ Transaction Mobile Money suspecte sur votre compte",
    html: (name, link) => `
      <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#f97316;padding:16px;border-radius:8px 8px 0 0;text-align:center;">
          <h2 style="color:white;margin:0;">Orange Money</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p>Cher(e) ${name},</p>
          <p>Nous avons detecte une <strong>transaction suspecte de 150 000 FCFA</strong> sur votre compte Orange Money.</p>
          <p>Si vous n'etes pas a l'origine de cette transaction, veuillez la <strong>bloquer immediatement</strong> :</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="background:#f97316;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Bloquer la transaction
            </a>
          </div>
          <p style="color:#666;font-size:12px;">Si vous ne reagissez pas dans les 2 heures, la transaction sera validee.</p>
        </div>
      </div>`,
  },
  bank: {
    subject: "🏦 Mise a jour de securite requise — Action immediate",
    html: (name, link) => `
      <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#1e40af;padding:16px;border-radius:8px 8px 0 0;text-align:center;">
          <h2 style="color:white;margin:0;">Banque Nationale</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p>Bonjour ${name},</p>
          <p>Suite a une mise a jour de nos systemes de securite, votre compte doit etre <strong>reactive sous 24h</strong>.</p>
          <p>Veuillez confirmer votre identite pour eviter la suspension de votre compte :</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="background:#1e40af;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Reactiver mon compte
            </a>
          </div>
          <p style="color:#666;font-size:12px;">Service Clientele — Ne pas repondre a cet email.</p>
        </div>
      </div>`,
  },
  delivery: {
    subject: "📦 Votre colis est en attente — Frais de livraison a regler",
    html: (name, link) => `
      <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#dc2626;padding:16px;border-radius:8px 8px 0 0;text-align:center;">
          <h2 style="color:white;margin:0;">DHL Express</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p>Bonjour ${name},</p>
          <p>Votre colis <strong>DK-238471</strong> est arrive au centre de tri mais des <strong>frais de douane de 3 500 FCFA</strong> restent a regler.</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="background:#dc2626;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Payer et recevoir mon colis
            </a>
          </div>
          <p style="color:#666;font-size:12px;">Votre colis sera retourne dans 48h sans paiement.</p>
        </div>
      </div>`,
  },
  internal: {
    subject: "📋 [RH] Mise a jour obligatoire de vos informations",
    html: (name, link) => `
      <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#7c3aed;padding:16px;border-radius:8px 8px 0 0;text-align:center;">
          <h2 style="color:white;margin:0;">Direction des Ressources Humaines</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p>Bonjour ${name},</p>
          <p>Dans le cadre de la mise a jour annuelle de nos dossiers, merci de <strong>verifier et completer vos informations personnelles</strong> avant vendredi.</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="background:#7c3aed;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Mettre a jour mes informations
            </a>
          </div>
          <p style="color:#666;font-size:12px;">Ce formulaire est obligatoire — Direction RH</p>
        </div>
      </div>`,
  },
  email_phishing: {
    subject: "🔒 Votre mot de passe expire dans 24h",
    html: (name, link) => `
      <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#059669;padding:16px;border-radius:8px 8px 0 0;text-align:center;">
          <h2 style="color:white;margin:0;">Service Informatique</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p>Bonjour ${name},</p>
          <p>Votre mot de passe professionnel <strong>expire dans 24 heures</strong>. Pour eviter une interruption de service, veuillez le renouveler maintenant :</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${link}" style="background:#059669;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Renouveler mon mot de passe
            </a>
          </div>
          <p style="color:#666;font-size:12px;">Support IT — Ce lien expire dans 24h.</p>
        </div>
      </div>`,
  },
};

// ── GET single campaign ──────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const orgId = sessionUser(session).organizationId;

  const campaign = await db.phishingCampaign.findFirst({
    where: { id, organizationId: orgId! },
    include: {
      results: {
        include: { user: { select: { name: true, email: true, department: true } } },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

// ── PATCH — launch / pause / complete campaign ───────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const orgId = sessionUser(session).organizationId;
  const role = sessionUser(session).role;

  if (role === "EMPLOYEE") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const campaign = await db.phishingCampaign.findFirst({
    where: { id, organizationId: orgId! },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
  }

  const { action } = await request.json();

  // ── Launch campaign: create results + send emails ──
  if (action === "launch") {
    if (campaign.status !== "DRAFT") {
      return NextResponse.json({ error: "Seule une campagne DRAFT peut etre lancee" }, { status: 400 });
    }

    // Find target employees
    const targets = await db.user.findMany({
      where: {
        organizationId: orgId!,
        role: "EMPLOYEE",
        ...(campaign.targetDepts.length > 0
          ? { department: { in: campaign.targetDepts } }
          : {}),
      },
      select: { id: true, name: true, email: true },
    });

    if (targets.length === 0) {
      return NextResponse.json({ error: "Aucun employe cible" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "https://roxshield.vercel.app";
    const template = phishingTemplates[campaign.templateType] || phishingTemplates.email_phishing;

    // Create PhishingResult for each target
    await db.phishingResult.createMany({
      data: targets.map((t) => ({
        userId: t.id,
        campaignId: campaign.id,
        action: "SENT",
      })),
      skipDuplicates: true,
    });

    // Send simulation emails (best-effort)
    let sentCount = 0;
    for (const target of targets) {
      const trackingLink = `${baseUrl}/api/campaigns/${campaign.id}/track?uid=${target.id}`;
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: [target.email],
          subject: template.subject,
          html: template.html(target.name || "Collaborateur", trackingLink),
        });
        sentCount++;
      } catch (err) {
        console.error(`[campaign] Echec envoi a ${target.email}:`, err);
      }
    }

    // Update campaign status
    const updated = await db.phishingCampaign.update({
      where: { id: campaign.id },
      data: {
        status: "ACTIVE",
        startedAt: new Date(),
        sentCount,
        totalTargets: targets.length,
      },
    });

    await db.activityLog.create({
      data: {
        action: "campaign_launched",
        description: `Campagne "${campaign.name}" lancee — ${sentCount} emails envoyes`,
        userId: session.user.id,
        organizationId: orgId!,
      },
    });

    return NextResponse.json({ ...updated, sentCount });
  }

  // ── Complete campaign ──
  if (action === "complete") {
    const updated = await db.phishingCampaign.update({
      where: { id: campaign.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  // ── Pause campaign ──
  if (action === "pause") {
    const updated = await db.phishingCampaign.update({
      where: { id: campaign.id },
      data: { status: "PAUSED" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

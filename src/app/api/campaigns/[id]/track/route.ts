import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// When an employee clicks the phishing link, record the click and show an educational page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: campaignId } = await params;
  const uid = request.nextUrl.searchParams.get("uid");

  if (!uid) {
    return new NextResponse("Lien invalide", { status: 400 });
  }

  // Record the click
  try {
    await db.phishingResult.updateMany({
      where: { campaignId, userId: uid, action: "SENT" },
      data: { action: "CLICKED", clickedAt: new Date() },
    });

    // Update campaign click count
    await db.phishingCampaign.update({
      where: { id: campaignId },
      data: { clickCount: { increment: 1 } },
    });

    // Update user risk score (increase by 5 points for clicking)
    await db.user.update({
      where: { id: uid },
      data: { riskScore: { increment: 5 } },
    });

    // Notification for the employee
    await db.notification.create({
      data: {
        title: "Simulation de phishing",
        message: "Vous avez clique sur un lien de simulation. Consultez la page de sensibilisation pour apprendre a vous proteger.",
        type: "warning",
        link: "/employee/results",
        userId: uid,
      },
    });
  } catch {
    // May fail if already clicked — that's fine
  }

  // Return educational awareness page
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Simulation de phishing — RoxShield</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:system-ui,-apple-system,sans-serif; background:#0f0f23; color:#e0e0e0; min-height:100vh; display:flex; align-items:center; justify-content:center; }
    .card { max-width:520px; margin:24px; text-align:center; }
    .icon { font-size:64px; margin-bottom:16px; }
    h1 { color:#f87171; font-size:24px; margin-bottom:12px; }
    h2 { color:#c084fc; font-size:18px; margin:24px 0 12px; }
    p { line-height:1.7; margin-bottom:12px; color:#aaa; }
    .highlight { background:rgba(156,30,153,0.15); border:1px solid rgba(156,30,153,0.3); border-radius:12px; padding:20px; margin:20px 0; text-align:left; }
    .highlight li { margin-bottom:8px; color:#e0e0e0; }
    .badge { display:inline-block; background:linear-gradient(135deg,#9c1e99,#c084fc); color:white; padding:8px 24px; border-radius:8px; font-weight:bold; margin-top:16px; text-decoration:none; }
    .footer { margin-top:32px; font-size:12px; color:#666; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🎣</div>
    <h1>C'etait une simulation de phishing !</h1>
    <p>Pas de panique — cet email faisait partie d'un exercice de sensibilisation organise par votre entreprise via <strong>RoxShield CyberSense</strong>.</p>

    <h2>Pourquoi avez-vous clique ?</h2>
    <p>Les emails de phishing utilisent des techniques psychologiques pour vous pousser a agir vite :</p>

    <div class="highlight">
      <ul style="padding-left:20px;">
        <li><strong>Urgence artificielle</strong> — "dans 2 heures", "sous 24h"</li>
        <li><strong>Autorite</strong> — se faire passer pour un superieur ou service officiel</li>
        <li><strong>Peur</strong> — menace de suspension de compte ou perte d'argent</li>
        <li><strong>Appat</strong> — colis, gain, mise a jour obligatoire</li>
      </ul>
    </div>

    <h2>Les bons reflexes</h2>
    <div class="highlight">
      <ul style="padding-left:20px;">
        <li>Verifiez toujours l'adresse email de l'expediteur</li>
        <li>Ne cliquez jamais sur un lien urgent sans verification</li>
        <li>Contactez l'expediteur par un autre canal (telephone, en personne)</li>
        <li>Signalez les emails suspects a votre service IT</li>
      </ul>
    </div>

    <a href="/" class="badge">Retour a RoxShield</a>

    <p class="footer">RoxShield CyberSense — Rostel High-Tech, Dakar, Senegal</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

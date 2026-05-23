import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendInstance) resendInstance = new Resend(apiKey);
  return resendInstance;
}

const FROM = "RoxShield <onboarding@resend.dev>";

// ── Wrapper ────────────────────────────────────────────────────────
function layout(title: string, body: string) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0f0f23;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#9c1e99,#fa990e);padding:24px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🛡️ RoxShield CyberSense</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">${title}</p>
    </div>
    <div style="background:#1a1a2e;color:#e0e0e0;padding:32px 24px;border-radius:0 0 12px 12px;line-height:1.6;">
      ${body}
      <hr style="border:none;border-top:1px solid #333;margin:24px 0;"/>
      <p style="color:#666;font-size:11px;margin:0;text-align:center;">
        RoxShield CyberSense — Rostel High-Tech, Dakar, S&eacute;n&eacute;gal<br/>
        <a href="https://roxshield.vercel.app" style="color:#c084fc;">roxshield.vercel.app</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Invitation employé ─────────────────────────────────────────────
export async function sendInvitationEmail(opts: {
  to: string;
  employeeName: string;
  organizationName: string;
  invitedBy: string;
  tempPassword: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant — email non envoyé");
    return { success: false, reason: "no_api_key" };
  }

  const loginUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "https://roxshield.vercel.app";

  const html = layout("Bienvenue dans votre espace cybersécurité", `
    <p>Bonjour <strong>${opts.employeeName || "collaborateur"}</strong>,</p>
    <p>
      <strong>${opts.invitedBy}</strong> vous a ajouté à l'espace
      <strong>${opts.organizationName}</strong> sur RoxShield CyberSense.
    </p>
    <p>RoxShield vous aidera à :</p>
    <ul style="padding-left:20px;color:#c084fc;">
      <li style="color:#e0e0e0;margin-bottom:8px;">Détecter les tentatives de phishing</li>
      <li style="color:#e0e0e0;margin-bottom:8px;">Suivre vos formations cybersécurité</li>
      <li style="color:#e0e0e0;margin-bottom:8px;">Améliorer votre score de sécurité</li>
    </ul>
    <div style="text-align:center;margin:28px 0;">
      <a href="${loginUrl}/login" style="display:inline-block;background:linear-gradient(135deg,#9c1e99,#c084fc);color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:16px;">
        Accéder à mon espace
      </a>
    </div>
    <div style="background:#0f0f23;border:1px solid #333;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:13px;">Vos identifiants de connexion :</p>
      <table style="width:100%;">
        <tr>
          <td style="color:#888;padding:4px 0;width:130px;">Email</td>
          <td style="color:#c084fc;font-weight:bold;">${opts.to}</td>
        </tr>
        <tr>
          <td style="color:#888;padding:4px 0;">Mot de passe</td>
          <td style="color:#fa990e;font-weight:bold;font-family:monospace;">${opts.tempPassword}</td>
        </tr>
      </table>
      <p style="margin:12px 0 0;color:#f87171;font-size:12px;">
        ⚠️ Changez votre mot de passe dès votre première connexion.
      </p>
    </div>
  `);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [opts.to],
      subject: `Bienvenue sur RoxShield — ${opts.organizationName}`,
      html,
    });

    if (error) {
      console.error("[email] Erreur Resend:", error);
      return { success: false, reason: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[email] Exception envoi:", err);
    return { success: false, reason: "send_failed" };
  }
}

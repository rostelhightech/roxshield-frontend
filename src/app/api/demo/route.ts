import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL || "contact@rostelhightech.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, phone, teamSize, country, message } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service email non configuré" },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    if (!name || !email || !organization) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Email to the team
    await resend.emails.send({
      from: "RoxShield <onboarding@resend.dev>",
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[RoxShield Demo] Nouvelle demande — ${organization} (${name})`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9c1e99, #fa990e); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nouvelle demande de demo</h1>
          </div>
          <div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 120px;">Nom</td>
                <td style="padding: 8px 0; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #c084fc;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Organisation</td>
                <td style="padding: 8px 0; font-weight: bold;">${organization}</td>
              </tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Tel / WhatsApp</td><td style="padding: 8px 0;"><a href="https://wa.me/${phone.replace(/[^0-9+]/g, "")}" style="color: #25d366;">${phone}</a></td></tr>` : ""}
              ${teamSize ? `<tr><td style="padding: 8px 0; color: #888;">Taille equipe</td><td style="padding: 8px 0;">${teamSize}</td></tr>` : ""}
              ${country ? `<tr><td style="padding: 8px 0; color: #888;">Pays</td><td style="padding: 8px 0;">${country}</td></tr>` : ""}
            </table>
            ${message ? `<hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" /><div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>` : ""}
            <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
            <p style="color: #666; font-size: 12px; margin: 0;">
              Envoy&eacute; depuis la page Demo RoxShield
            </p>
          </div>
        </div>
      `,
    });

    // Confirmation email to the prospect
    await resend.emails.send({
      from: "RoxShield <onboarding@resend.dev>",
      to: [email],
      subject: "Votre demande de demo RoxShield a bien ete recue",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9c1e99, #fa990e); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">RoxShield</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">Your Human Firewall</p>
          </div>
          <div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; border-radius: 0 0 12px 12px;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Merci pour votre interet pour RoxShield ! Nous avons bien recu votre demande de demonstration.</p>
            <p>Un membre de notre equipe vous contactera dans les <strong>24 heures</strong> pour planifier votre session.</p>
            <div style="background: #252540; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px; color: #c084fc; font-weight: bold;">Ce que vous decouvrirez :</p>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Simulations de phishing realistes</li>
                <li>Micro-formations gamifiees</li>
                <li>Dashboard de risque humain</li>
                <li>Rapports par departement</li>
              </ul>
            </div>
            <p>A tres bientot !</p>
            <p style="color: #888;">L'equipe RoxShield<br/>Par Rostel High-Tech</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
            <p style="color: #666; font-size: 11px; text-align: center;">
              <a href="https://roxshield.rostelhightech.com" style="color: #c084fc;">roxshield.rostelhightech.com</a>
              &nbsp;&bull;&nbsp;
              <a href="https://www.rostelhightech.com" style="color: #c084fc;">rostelhightech.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo email error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}

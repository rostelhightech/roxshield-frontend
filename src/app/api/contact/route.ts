import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { EMAIL_FROM } from "@/lib/email";

const TO_EMAIL = process.env.CONTACT_EMAIL || "contact@rostelhightech.com";

function sanitize(str: string) {
  return str.replace(/[<>]/g, "").trim().slice(0, 1000);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(request: Request) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { success } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: "Trop de requetes. Reessayez dans une minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitize(body.name || "");
    const email = sanitize(body.email || "");
    const subject = sanitize(body.subject || "");
    const message = sanitize(body.message || "");

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service email non configure" },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[RoxShield Contact] ${subject || "Nouveau message"} — ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9c1e99, #fa990e); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message de contact</h1>
          </div>
          <div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 100px;">Nom</td>
                <td style="padding: 8px 0; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #c084fc;">${email}</a></td>
              </tr>
              ${subject ? `<tr><td style="padding: 8px 0; color: #888;">Sujet</td><td style="padding: 8px 0;">${subject}</td></tr>` : ""}
            </table>
            <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
            <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
            <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
            <p style="color: #666; font-size: 12px; margin: 0;">
              Envoy&eacute; depuis le formulaire de contact RoxShield
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}

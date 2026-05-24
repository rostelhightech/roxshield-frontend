import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { EMAIL_FROM } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTempPassword(): string {
  const alpha = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  let pwd = "";
  for (let i = 0; i < 3; i++) pwd += alpha[Math.floor(Math.random() * alpha.length)];
  for (let i = 0; i < 4; i++) pwd += digits[Math.floor(Math.random() * digits.length)];
  for (let i = 0; i < 3; i++) pwd += alpha[Math.floor(Math.random() * alpha.length)];
  return pwd;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 password resets per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { success: rlOk } = rateLimit(`forgot:${ip}`, { maxRequests: 3, windowMs: 60_000 });
    if (!rlOk) {
      return NextResponse.json({ error: "Trop de tentatives. Reessayez dans une minute." }, { status: 429 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      const tempPassword = generateTempPassword();
      const hashed = await bcrypt.hash(tempPassword, 12);

      await db.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });

      // Send email with new password
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: "RoxShield — Réinitialisation de votre mot de passe",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #9c1e99, #c34cbf); line-height: 48px; text-align: center;">
                  <span style="color: white; font-size: 20px; font-weight: bold;">🛡️</span>
                </div>
                <h1 style="margin: 16px 0 4px; font-size: 20px; color: #1a1a2e;">Mot de passe réinitialisé</h1>
                <p style="color: #888; font-size: 14px; margin: 0;">Votre nouveau mot de passe temporaire</p>
              </div>

              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Nouveau mot de passe</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #9c1e99; font-family: monospace;">${tempPassword}</p>
              </div>

              <p style="font-size: 13px; color: #666; text-align: center;">
                Connectez-vous avec ce mot de passe puis changez-le dans vos paramètres de profil.
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="font-size: 11px; color: #aaa; text-align: center;">
                Si vous n'avez pas demandé cette réinitialisation, contactez votre administrateur.
              </p>
            </div>
          `,
        });
      } catch {
        // Email sending failed but password was still updated
        console.error("Failed to send password reset email");
      }
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      message: "Si un compte existe avec cet email, un nouveau mot de passe a été envoyé.",
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

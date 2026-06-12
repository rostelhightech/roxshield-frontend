export const templatesList = {

    microsoft365 :  `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Action requise</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; padding: 40px 20px; }
    .wrapper { max-width: 600px; margin: 0 auto; }
    .card { background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

    .header { background: #0078d4; padding: 28px 40px; display: flex; align-items: center; gap: 12px; }
    .header-logo { width: 32px; height: 32px; background: #fff; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
    .header-logo svg { width: 20px; height: 20px; }
    .header-title { color: #ffffff; font-size: 18px; font-weight: 600; }

    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #1a1a1a; margin-bottom: 16px; }
    .text { font-size: 14px; color: #444; line-height: 1.7; margin-bottom: 16px; }
    .alert-box { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 0 6px 6px 0; padding: 14px 16px; margin: 20px 0; }
    .alert-box p { font-size: 13px; color: #92400e; line-height: 1.6; }
    .cta-wrap { text-align: center; margin: 28px 0; }
    .cta { display: inline-block; background: #0078d4; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 6px; font-size: 14px; font-weight: 600; letter-spacing: 0.2px; }
    .cta:hover { background: #006cbf; }
    .expiry { text-align: center; font-size: 12px; color: #999; margin-top: -8px; margin-bottom: 20px; }
    .divider { border: none; border-top: 1px solid #f0f0f0; margin: 24px 0; }
    .small { font-size: 12px; color: #888; line-height: 1.6; }

    .footer { background: #f8f9fa; padding: 20px 40px; border-top: 1px solid #eee; }
    .footer p { font-size: 11px; color: #aaa; line-height: 1.7; }
    .footer a { color: #0078d4; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <div class="header-logo">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="7" height="7" fill="#0078d4"/>
            <rect x="11" y="2" width="7" height="7" fill="#0078d4"/>
            <rect x="2" y="11" width="7" height="7" fill="#0078d4"/>
            <rect x="11" y="11" width="7" height="7" fill="#0078d4"/>
          </svg>
        </div>
        <span class="header-title">Microsoft 365</span>
      </div>

      <div class="body">
        <p class="greeting">Bonjour {{.FirstName}} {{.LastName}},</p>
        <p class="text">
          Nous avons détecté une connexion inhabituele à votre compte Microsoft 365
          associé à l'adresse <strong>{{.Email}}</strong>.
          Pour protéger votre compte, une vérification est nécessaire.
        </p>

        <div class="alert-box">
          <p>
            <strong>Connexion suspecte détectée</strong><br>
            Appareil inconnu · Localisation inhabituelle · {{.Position}}
          </p>
        </div>

        <p class="text">
          Si vous êtes à l'origine de cette connexion, aucune action n'est requise.
          Dans le cas contraire, sécurisez immédiatement votre compte en cliquant ci-dessous.
        </p>

        <div class="cta-wrap">
          <a href="{{.URL}}" class="cta">Sécuriser mon compte</a>
        </div>
        <p class="expiry">Ce lien expire dans <strong>24 heures</strong>.</p>

        <hr class="divider">

        <p class="small">
          Si vous n'avez pas demandé cette vérification, ignorez cet email.
          Pour toute question, contactez votre administrateur IT.
        </p>
      </div>

      <div class="footer">
        <p>
          Cet email a été envoyé à <a href="#">{{.Email}}</a> par {{.From}}.<br>
          Microsoft Corporation · One Microsoft Way · Redmond, WA 98052<br>
          <a href="#">Politique de confidentialité</a> · <a href="#">Se désabonner</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`
}
/**
 * Génère un rapport PDF via window.print() dans une fenêtre dédiée.
 * Le HTML est stylé pour l'impression — le navigateur propose "Save as PDF".
 */

interface ReportData {
  organizationName: string;
  date: string;
  avgRiskScore: number;
  totalEmployees: number;
  trainingRate: number;
  clickRate: number;
  employeesAtRisk: number;
  activeCampaigns: number;
  statusDistribution: { safe: number; moderate: number; atRisk: number };
  departments: { name: string; avgRisk: number; count: number }[];
  topRiskEmployees: { name: string; email: string; department: string; riskScore: number }[];
  trainingModules: { title: string; progressPercent: number }[];
}

function riskColor(score: number) {
  if (score <= 30) return "#25d366";
  if (score <= 60) return "#fa990e";
  return "#ef4444";
}

function riskLabel(score: number) {
  if (score <= 30) return "Faible";
  if (score <= 60) return "Modéré";
  return "Élevé";
}

export function generatePdfReport(data: ReportData) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>Rapport RoxShield — ${data.organizationName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.5; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #9c1e99; padding-bottom: 16px; margin-bottom: 32px; }
    .header h1 { font-size: 24px; color: #9c1e99; }
    .header .meta { text-align: right; font-size: 12px; color: #666; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .kpi { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; text-align: center; }
    .kpi .value { font-size: 28px; font-weight: 700; }
    .kpi .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .section { margin-bottom: 28px; page-break-inside: avoid; }
    .section h2 { font-size: 16px; color: #9c1e99; border-bottom: 1px solid #e0e0e0; padding-bottom: 6px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f5f5f5; text-align: left; padding: 8px 10px; border-bottom: 2px solid #ddd; font-weight: 600; }
    td { padding: 7px 10px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) { background: #fafafa; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; color: #fff; }
    .progress-bar { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; width: 120px; display: inline-block; vertical-align: middle; }
    .progress-fill { height: 100%; border-radius: 4px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #999; text-align: center; }
    .status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .status-card { border-radius: 8px; padding: 12px; text-align: center; }
    .status-card .count { font-size: 24px; font-weight: 700; }
    .status-card .label { font-size: 11px; }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🛡️ RoxShield CyberSense</h1>
      <p style="font-size:13px;color:#666;">Rapport de sécurité — ${data.organizationName}</p>
    </div>
    <div class="meta">
      <p><strong>Date :</strong> ${data.date}</p>
      <p>Généré automatiquement</p>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="value" style="color:${riskColor(data.avgRiskScore)}">${data.avgRiskScore}%</div>
      <div class="label">Score de risque moyen</div>
    </div>
    <div class="kpi">
      <div class="value" style="color:#25d366">${data.trainingRate}%</div>
      <div class="label">Taux de formation</div>
    </div>
    <div class="kpi">
      <div class="value" style="color:#ef4444">${data.clickRate}%</div>
      <div class="label">Taux de clic phishing</div>
    </div>
    <div class="kpi">
      <div class="value" style="color:#9c1e99">${data.totalEmployees}</div>
      <div class="label">Total employés</div>
    </div>
  </div>

  <div class="section">
    <h2>Distribution des statuts</h2>
    <div class="status-grid">
      <div class="status-card" style="background:#25d36610;border:1px solid #25d36640;">
        <div class="count" style="color:#25d366;">${data.statusDistribution.safe}</div>
        <div class="label" style="color:#25d366;">Sécurisés</div>
      </div>
      <div class="status-card" style="background:#fa990e10;border:1px solid #fa990e40;">
        <div class="count" style="color:#fa990e;">${data.statusDistribution.moderate}</div>
        <div class="label" style="color:#fa990e;">Modérés</div>
      </div>
      <div class="status-card" style="background:#ef444410;border:1px solid #ef444440;">
        <div class="count" style="color:#ef4444;">${data.statusDistribution.atRisk}</div>
        <div class="label" style="color:#ef4444;">À risque</div>
      </div>
    </div>
  </div>

  ${data.departments.length > 0 ? `
  <div class="section">
    <h2>Risque par département</h2>
    <table>
      <thead><tr><th>Département</th><th>Employés</th><th>Risque moyen</th><th>Niveau</th></tr></thead>
      <tbody>
        ${data.departments.map((d) => `
          <tr>
            <td><strong>${d.name || "—"}</strong></td>
            <td>${d.count}</td>
            <td>
              <div class="progress-bar"><div class="progress-fill" style="width:${d.avgRisk}%;background:${riskColor(d.avgRisk)};"></div></div>
              <span style="margin-left:8px;font-weight:600;">${d.avgRisk}%</span>
            </td>
            <td><span class="badge" style="background:${riskColor(d.avgRisk)};">${riskLabel(d.avgRisk)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>` : ""}

  ${data.topRiskEmployees.length > 0 ? `
  <div class="section">
    <h2>Employés à risque élevé (Top 10)</h2>
    <table>
      <thead><tr><th>Nom</th><th>Email</th><th>Département</th><th>Score</th></tr></thead>
      <tbody>
        ${data.topRiskEmployees.map((e) => `
          <tr>
            <td><strong>${e.name || "—"}</strong></td>
            <td>${e.email}</td>
            <td>${e.department || "—"}</td>
            <td><span class="badge" style="background:${riskColor(e.riskScore)};">${e.riskScore}%</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>` : ""}

  ${data.trainingModules.length > 0 ? `
  <div class="section">
    <h2>Progression des formations</h2>
    <table>
      <thead><tr><th>Module</th><th>Progression</th></tr></thead>
      <tbody>
        ${data.trainingModules.map((m) => `
          <tr>
            <td>${m.title}</td>
            <td>
              <div class="progress-bar"><div class="progress-fill" style="width:${m.progressPercent}%;background:#9c1e99;"></div></div>
              <span style="margin-left:8px;font-weight:600;">${m.progressPercent}%</span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>` : ""}

  <div class="footer">
    <p>RoxShield CyberSense — Rostel High-Tech, Dakar, Sénégal</p>
    <p>Ce rapport est confidentiel et destiné exclusivement à l'usage interne de ${data.organizationName}.</p>
  </div>
</body>
</html>`;

  // Ouvrir dans une nouvelle fenêtre et imprimer
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback : télécharger le HTML
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roxshield-rapport-${data.date}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Attendre le chargement puis lancer l'impression
  printWindow.onload = () => {
    printWindow.print();
  };
  // Fallback pour navigateurs qui ne déclenchent pas onload
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

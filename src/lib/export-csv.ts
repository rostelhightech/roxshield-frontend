/**
 * Utility to export data as CSV file.
 * Handles special characters, commas, and French accents.
 */

interface ExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
  separator?: string;
}

export function exportCSV({ filename, headers, rows, separator = ";" }: ExportOptions) {
  const BOM = "﻿"; // UTF-8 BOM for Excel compatibility with French accents

  const escapeCell = (value: string | number): string => {
    const str = String(value);
    if (str.includes(separator) || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(separator);
  const dataLines = rows.map((row) => row.map(escapeCell).join(separator));
  const csvContent = BOM + [headerLine, ...dataLines].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a date for export (DD/MM/YYYY)
 */
export function formatDateFR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

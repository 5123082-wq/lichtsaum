import "server-only";

import { eq } from "drizzle-orm";
import { Resend } from "resend";

import { getDb } from "@/db";
import { leadFiles, leads } from "@/db/schema";

import { buildLeadFileDownloadUrl } from "./download-security";
import { formatPublicLeadNumber } from "./public-lead-number";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for lead notifications.`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionalText(value: string | null) {
  return value?.trim() || "—";
}

export async function sendLeadNotification(leadId: string) {
  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      leadId: leads.leadId,
      idempotencyKey: leads.idempotencyKey,
      email: leads.email,
      phone: leads.phone,
      projectContext: leads.projectContext,
      sourcePath: leads.sourcePath,
      createdAt: leads.createdAt
    })
    .from(leads)
    .where(eq(leads.leadId, leadId))
    .limit(1);

  if (!lead) {
    throw new Error("Lead notification data was not found.");
  }

  const files = await db
    .select({
      fileId: leadFiles.fileId,
      originalName: leadFiles.originalName,
      mediaType: leadFiles.mediaType,
      byteSize: leadFiles.byteSize
    })
    .from(leadFiles)
    .where(eq(leadFiles.leadId, lead.id));

  const fileLinks = files.map((file) => ({
    ...file,
    url: buildLeadFileDownloadUrl(lead.leadId, file.fileId)
  }));
  const textFiles = fileLinks.length
    ? fileLinks
        .map((file) => `- ${file.originalName}: ${file.url}`)
        .join("\n")
    : "Keine Dateien angehängt.";
  const htmlFiles = fileLinks.length
    ? `<ul>${fileLinks
        .map(
          (file) =>
            `<li><a href="${escapeHtml(file.url)}">${escapeHtml(file.originalName)}</a> (${Math.ceil(file.byteSize / 1024)} KB)</li>`
        )
        .join("")}</ul>`
    : "<p>Keine Dateien angehängt.</p>";
  const text = [
    "Neue LICHTSAUM Projektanfrage",
    "",
    `Lead-ID: ${lead.leadId}`,
    `E-Mail: ${lead.email}`,
    `Telefon: ${optionalText(lead.phone)}`,
    `Quelle: ${lead.sourcePath}`,
    `Zeitpunkt: ${lead.createdAt.toISOString()}`,
    "",
    "Nachricht:",
    optionalText(lead.projectContext),
    "",
    "Dateien (Links sind 7 Tage gültig):",
    textFiles
  ].join("\n");
  const html = `
    <h1>Neue LICHTSAUM Projektanfrage</h1>
    <dl>
      <dt>Lead-ID</dt><dd>${escapeHtml(lead.leadId)}</dd>
      <dt>E-Mail</dt><dd><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></dd>
      <dt>Telefon</dt><dd>${escapeHtml(optionalText(lead.phone))}</dd>
      <dt>Quelle</dt><dd>${escapeHtml(lead.sourcePath)}</dd>
      <dt>Zeitpunkt</dt><dd>${escapeHtml(lead.createdAt.toISOString())}</dd>
    </dl>
    <h2>Nachricht</h2>
    <p>${escapeHtml(optionalText(lead.projectContext)).replaceAll("\n", "<br>")}</p>
    <h2>Dateien</h2>
    <p>Download-Links sind 7 Tage gültig.</p>
    ${htmlFiles}
  `;
  const publicLeadNumber = formatPublicLeadNumber(lead.id, lead.createdAt);
  const resend = new Resend(requiredEnv("RESEND_API_KEY"));
  const { data, error } = await resend.emails.send(
    {
      from: requiredEnv("LEAD_EMAIL_FROM"),
      to: requiredEnv("LEAD_NOTIFICATION_TO"),
      replyTo: lead.email,
      subject: `Neue LICHTSAUM Projektanfrage · ${publicLeadNumber}`,
      text,
      html
    },
    { idempotencyKey: `lead-notification/${lead.idempotencyKey}` }
  );

  if (error || !data?.id) {
    throw new Error("Lead notification could not be delivered to Resend.");
  }

  return data.id;
}

export async function sendLeadCustomerConfirmation(leadId: string) {
  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      email: leads.email,
      idempotencyKey: leads.idempotencyKey,
      createdAt: leads.createdAt
    })
    .from(leads)
    .where(eq(leads.leadId, leadId))
    .limit(1);

  if (!lead) {
    throw new Error("Lead confirmation data was not found.");
  }

  const publicLeadNumber = formatPublicLeadNumber(lead.id, lead.createdAt);
  const text = [
    "Vielen Dank für Ihre Projektanfrage.",
    "",
    "Wir haben Ihre Anfrage erhalten.",
    `Ihre Anfragenummer: ${publicLeadNumber}`,
    "",
    "Bitte geben Sie diese Nummer bei Rückfragen an.",
    "Wir melden uns über die von Ihnen angegebene Kontaktmöglichkeit.",
    "",
    "Freundliche Grüße",
    "LICHTSAUM"
  ].join("\n");
  const html = `
    <h1>Vielen Dank für Ihre Projektanfrage.</h1>
    <p>Wir haben Ihre Anfrage erhalten.</p>
    <p><strong>Ihre Anfragenummer: ${escapeHtml(publicLeadNumber)}</strong></p>
    <p>Bitte geben Sie diese Nummer bei Rückfragen an.</p>
    <p>Wir melden uns über die von Ihnen angegebene Kontaktmöglichkeit.</p>
    <p>Freundliche Grüße<br>LICHTSAUM</p>
  `;
  const resend = new Resend(requiredEnv("RESEND_API_KEY"));
  const { data, error } = await resend.emails.send(
    {
      from: requiredEnv("LEAD_EMAIL_FROM"),
      to: lead.email,
      replyTo: requiredEnv("LEAD_NOTIFICATION_TO"),
      subject: `Ihre Projektanfrage ${publicLeadNumber} ist eingegangen`,
      text,
      html
    },
    { idempotencyKey: `lead-customer-confirmation/${lead.idempotencyKey}` }
  );

  if (error || !data?.id) {
    throw new Error("Lead customer confirmation could not be delivered to Resend.");
  }

  return data.id;
}

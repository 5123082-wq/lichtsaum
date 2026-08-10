const PUBLIC_LEAD_NUMBER_PREFIX = "LS";

const berlinYearFormatter = new Intl.DateTimeFormat("en", {
  timeZone: "Europe/Berlin",
  year: "numeric"
});

export function formatPublicLeadNumber(id: number, createdAt: Date) {
  return `${PUBLIC_LEAD_NUMBER_PREFIX}-${berlinYearFormatter.format(createdAt)}-${String(id).padStart(6, "0")}`;
}

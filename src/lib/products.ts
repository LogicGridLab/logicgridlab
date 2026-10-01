export type ProductType = "digital_file" | "saas_access" | "webapp_tool" | "spreadsheet";
export type BillingType = "one-time" | "monthly" | "yearly";

export const TYPE_LABEL: Record<ProductType, string> = {
  digital_file: "Digital File",
  saas_access: "SaaS",
  webapp_tool: "Web App",
  spreadsheet: "Excel / Sheets",
};

export function formatPrice(price: number, currency: string, billing: BillingType) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
  return billing === "monthly" ? `${amount}/mo` : billing === "yearly" ? `${amount}/yr` : amount;
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

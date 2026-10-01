import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const PAYONEER_EMAIL = "jdihs.doc@gmail.com";

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        productId: z.string().uuid(),
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(255),
        method: z.enum(["payoneer", "bank_transfer"]),
        reference: z.string().trim().min(3).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, price, currency, status")
      .eq("id", data.productId)
      .maybeSingle();
    if (pErr || !product || product.status !== "published") throw new Error("Product unavailable");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_name: data.name,
        customer_email: data.email.toLowerCase(),
        amount: product.price,
        currency: product.currency,
        payment_method: data.method,
        payment_reference: data.reference,
      })
      .select("id")
      .single();
    if (error) throw new Error("Could not create order");
    return { orderId: order.id };
  });

export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ orderId: z.string().uuid(), email: z.string().trim().email() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, customer_name, customer_email, amount, currency, payment_status, created_at, product_id")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.customer_email !== data.email.toLowerCase()) return { found: false as const };
    let product: { title: string; downloadable_file_url: string | null; external_access_url: string | null } | null = null;
    if (order.product_id) {
      const { data: p } = await supabaseAdmin
        .from("products")
        .select("title, downloadable_file_url, external_access_url")
        .eq("id", order.product_id)
        .maybeSingle();
      product = p;
    }
    let downloadUrl: string | null = null;
    let accessUrl: string | null = null;
    if (order.payment_status === "paid" && product) {
      accessUrl = product.external_access_url;
      if (product.downloadable_file_url) {
        const { data: signed } = await supabaseAdmin.storage
          .from("product-files")
          .createSignedUrl(product.downloadable_file_url, 60 * 30, { download: true });
        downloadUrl = signed?.signedUrl ?? null;
      }
    }
    return {
      found: true as const,
      status: order.payment_status,
      productTitle: product?.title ?? "Product",
      amount: Number(order.amount),
      currency: order.currency,
      createdAt: order.created_at,
      downloadUrl,
      accessUrl,
    };
  });

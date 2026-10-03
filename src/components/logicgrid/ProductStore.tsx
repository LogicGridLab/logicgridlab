import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, CreditCard, Loader2, Play, ShieldCheck, ShoppingBag, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createOrder, PAYONEER_EMAIL } from "@/lib/store.functions";
import { TYPE_LABEL, formatPrice, type BillingType, type ProductType } from "@/lib/products";

type PublicProduct = {
  id: string; title: string; slug: string; type: ProductType; price: number; currency: string;
  billing_type: BillingType; short_tagline: string | null; features: string[];
  cover_image_url: string | null; demo_url: string | null;
};

export default function ProductStore() {
  const [selected, setSelected] = useState<PublicProduct | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,slug,type,price,currency,billing_type,short_tagline,features,cover_image_url,demo_url,sort_order")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PublicProduct[];
    },
  });

  return (
    <section id="products" className="section-space">
      <div className="container-site">
        <div className="section-heading-row">
          <div className="section-heading"><p className="eyebrow"><span />Products Store</p><h2>Live Products & Roadmap</h2><p>Buy instantly and get access the moment your payment is confirmed.</p></div>
          <div className="secure-checkout"><ShieldCheck /><span><strong>Secure checkout</strong><small>Card · Payoneer · Instant delivery</small></span></div>
        </div>
        {isLoading ? (
          <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading products…</p>
        ) : (
          <div className="product-grid">
            {(data ?? []).map((p, i) => (
              <article key={p.id} className={`product-tile ${i === 0 ? "product-featured" : ""}`}>
                {p.cover_image_url && <img src={p.cover_image_url} alt={`${p.title} preview`} loading="lazy" className="mb-4 aspect-video w-full rounded-2xl border border-border object-cover" />}
                <div className="product-head"><span>{String(i + 1).padStart(2, "0")}</span><i>{TYPE_LABEL[p.type]}</i></div>
                <h3>{p.title}</h3>
                {p.short_tagline && <p>{p.short_tagline}</p>}
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {p.features.slice(0, 3).map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>)}
                </ul>
                <div className="product-bottom">
                  <div><strong>{formatPrice(Number(p.price), p.currency, p.billing_type)}</strong><span>{p.billing_type === "one-time" ? "Lifetime" : "Subscription"}</span></div>
                  <div className="product-buttons">
                    {p.demo_url && <Button variant="glass" asChild><a href={p.demo_url} target="_blank" rel="noreferrer" aria-label={`Open ${p.title} demo`}><Play />Demo</a></Button>}
                    <Button variant="premium" onClick={() => setSelected(p)}>{p.type === "saas_access" || p.type === "webapp_tool" ? "Get Access" : "Buy Now"} <ArrowRight /></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="checkout-trust"><ShoppingBag />Secure checkout <span /> Instant delivery <span /> 7-day guarantee</p>
      </div>
      <CheckoutDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function CheckoutDialog({ product, onClose }: { product: PublicProduct | null; onClose: () => void }) {
  const navigate = useNavigate();
  const submit = useServerFn(createOrder);
  const [method, setMethod] = useState<"card" | "payoneer">("payoneer");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const email = String(f.get("email") ?? "");
    const reference = String(f.get("reference") ?? "");
    setBusy(true);
    try {
      const { orderId } = await submit({ data: { productId: product.id, name, email, method: "payoneer", reference } });
      toast.success("Order received — we'll verify your payment shortly.");
      onClose();
      navigate({ to: "/order/$id", params: { id: orderId }, search: { email } });
    } catch {
      toast.error("Please check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>Checkout — {product.title}</DialogTitle>
              <DialogDescription>{formatPrice(Number(product.price), product.currency, product.billing_type)} · {TYPE_LABEL[product.type]}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMethod("card")} className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm ${method === "card" ? "border-primary bg-primary/10" : "border-border"}`}><CreditCard className="size-4" />Credit / Debit card</button>
              <button type="button" onClick={() => setMethod("payoneer")} className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm ${method === "payoneer" ? "border-primary bg-primary/10" : "border-border"}`}><Wallet className="size-4" />Payoneer</button>
            </div>
            {method === "card" ? (
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                Card checkout is being activated and will be available very soon. Please use Payoneer for now, or message us on WhatsApp for a card invoice.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                  <p className="font-medium text-foreground">How to pay with Payoneer</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                    <li>Send {formatPrice(Number(product.price), product.currency, product.billing_type)} to <strong className="text-foreground">{PAYONEER_EMAIL}</strong></li>
                    <li>Copy the transaction ID from Payoneer</li>
                    <li>Enter it below — we verify and unlock your access</li>
                  </ol>
                </div>
                <Input name="name" required minLength={2} maxLength={120} placeholder="Full name" aria-label="Full name" />
                <Input name="email" type="email" required maxLength={255} placeholder="Email address" aria-label="Email address" />
                <Input name="reference" required minLength={3} maxLength={200} placeholder="Payoneer transaction ID" aria-label="Payoneer transaction ID" />
                <Button type="submit" variant="premium" className="w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />}Submit payment for verification</Button>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

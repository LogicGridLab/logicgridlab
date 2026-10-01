import { useMemo, useState, type DragEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, FileUp, ImagePlus, Loader2, Pencil, Plus, Search, Trash2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TYPE_LABEL, formatPrice, slugify, type ProductType } from "@/lib/products";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type PayStatus = Order["payment_status"];

const card = "rounded-2xl border border-border bg-card/60 backdrop-blur-xl";
const th = "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 align-middle text-sm text-foreground";

function useProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });
}
function useOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as Order[];
    },
  });
}

export function ProductsView() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useProducts();
  const { data: orders } = useOrders();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | ProductType>("all");
  const [status, setStatus] = useState<"all" | Product["status"]>("all");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const sales = useMemo(() => {
    const m = new Map<string, number>();
    (orders ?? []).forEach((o) => o.payment_status === "paid" && o.product_id && m.set(o.product_id, (m.get(o.product_id) ?? 0) + 1));
    return m;
  }, [orders]);

  const rows = (products ?? []).filter((p) =>
    (type === "all" || p.type === type) && (status === "all" || p.status === status) && p.title.toLowerCase().includes(q.toLowerCase()));

  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["public-products"] }); };

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Product deleted"); refresh(); },
    onError: () => toast.error("Could not delete — it may have orders. Archive it instead."),
  });
  const toggle = useMutation({
    mutationFn: async (p: Product) => {
      const { error } = await supabase.from("products").update({ status: p.status === "published" ? "draft" : "published" }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  function duplicate(p: Product) {
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = p;
    setEditing({ ...rest, title: `${p.title} (copy)`, slug: `${p.slug}-copy`, status: "draft" });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9" aria-label="Search products" />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All types</SelectItem>{Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{["all", "published", "draft", "archived"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>)}</SelectContent>
        </Select>
        <Button onClick={() => setEditing({ type: "webapp_tool", billing_type: "one-time", currency: "USD", status: "draft", features: [], price: 0 })}><Plus className="size-4" />Add New Product</Button>
      </div>
      <div className={`${card} overflow-x-auto`}>
        {isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading…</p> : rows.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">No products found.</p> : (
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-border"><tr><th className={th}>Product</th><th className={th}>Type</th><th className={th}>Price</th><th className={th}>Status</th><th className={th}>Sales</th><th className={th}>Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className={td}><div className="flex items-center gap-3">
                    {p.cover_image_url ? <img src={p.cover_image_url} alt="" className="size-12 rounded-lg object-cover" /> : <div className="size-12 rounded-lg bg-muted" />}
                    <div><p className="font-medium">{p.title}</p><p className="text-xs text-muted-foreground">/{p.slug}</p></div>
                  </div></td>
                  <td className={td}><span className="rounded-full border border-border px-2 py-0.5 text-xs">{TYPE_LABEL[p.type]}</span></td>
                  <td className={td}>{formatPrice(Number(p.price), p.currency, p.billing_type)}</td>
                  <td className={td}><div className="flex items-center gap-2"><Switch checked={p.status === "published"} onCheckedChange={() => toggle.mutate(p)} aria-label="Toggle published" /><span className="text-xs capitalize text-muted-foreground">{p.status}</span></div></td>
                  <td className={td}>{sales.get(p.id) ?? 0}</td>
                  <td className={td}><div className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(p)}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Duplicate" onClick={() => duplicate(p)}><Copy className="size-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => confirm(`Delete ${p.title}?`) && remove.mutate(p.id)}><Trash2 className="size-4" /></Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ProductEditor initial={editing} onClose={() => setEditing(null)} onSaved={refresh} />
    </div>
  );
}

function DropZone({ label, icon: Icon, accept, onFile, busy, current }: { label: string; icon: typeof FileUp; accept: string; onFile: (f: File) => void; busy: boolean; current?: string | null }) {
  const [over, setOver] = useState(false);
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); };
  return (
    <label onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground ${over ? "border-primary bg-primary/10" : "border-border"}`}>
      {busy ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
      <span>{label}</span>
      {current && <span className="max-w-full truncate text-foreground">{current}</span>}
      <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </label>
  );
}

function ProductEditor({ initial, onClose, onSaved }: { initial: Partial<Product> | null; onClose: () => void; onSaved: () => void }) {
  return (
    <Dialog open={!!initial} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {initial && <EditorForm key={initial.id ?? initial.slug ?? "new"} initial={initial} onClose={onClose} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  );
}

function EditorForm({ initial, onClose, onSaved }: { initial: Partial<Product>; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Partial<Product>>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [feature, setFeature] = useState("");
  const [uploading, setUploading] = useState<"cover" | "file" | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((s) => ({ ...s, [k]: v }));
  const subscription = p.billing_type !== "one-time";

  async function upload(kind: "cover" | "file", f: File) {
    setUploading(kind);
    const bucket = kind === "cover" ? "product-covers" : "product-files";
    const path = `${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, f);
    if (error) { toast.error("Upload failed"); setUploading(null); return; }
    if (kind === "cover") {
      const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      set("cover_image_url", data?.signedUrl ?? null);
    } else set("downloadable_file_url", path);
    toast.success("Uploaded");
    setUploading(null);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!p.title?.trim() || !p.slug?.trim()) return toast.error("Title and slug are required");
    if (Number(p.price) < 0 || Number.isNaN(Number(p.price))) return toast.error("Enter a valid price");
    setSaving(true);
    const payload = {
      title: p.title.trim(), slug: slugify(p.slug), type: p.type!, price: Number(p.price), currency: (p.currency || "USD").toUpperCase().slice(0, 3),
      billing_type: p.billing_type!, short_tagline: p.short_tagline || null, description: p.description || null, features: p.features ?? [],
      cover_image_url: p.cover_image_url || null, downloadable_file_url: p.downloadable_file_url || null,
      external_access_url: p.external_access_url || null, demo_url: p.demo_url || null, status: p.status!, sort_order: p.sort_order ?? 0,
    };
    const { error } = p.id ? await supabase.from("products").update(payload).eq("id", p.id) : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.code === "23505" ? "That slug is already used" : "Could not save product");
    toast.success("Product saved");
    onSaved(); onClose();
  }

  const needsUrl = p.type === "saas_access" || p.type === "webapp_tool";
  return (
    <form onSubmit={save} className="space-y-4">
      <DialogHeader><DialogTitle>{p.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Title" value={p.title ?? ""} maxLength={120} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} aria-label="Title" />
        <Input placeholder="slug" value={p.slug ?? ""} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} aria-label="Slug" />
        <Select value={p.type} onValueChange={(v) => set("type", v as ProductType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={p.status} onValueChange={(v) => set("status", v as Product["status"])}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{["draft", "published", "archived"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input type="number" min={0} step="0.01" placeholder="Price" value={p.price ?? ""} onChange={(e) => set("price", e.target.value as unknown as number)} aria-label="Price" />
          <Input className="w-24" placeholder="USD" value={p.currency ?? "USD"} maxLength={3} onChange={(e) => set("currency", e.target.value)} aria-label="Currency" />
        </div>
        <div className="flex items-center gap-3 rounded-md border border-border px-3">
          <Switch checked={subscription} onCheckedChange={(on) => set("billing_type", on ? "monthly" : "one-time")} aria-label="Subscription" />
          <span className="text-sm">{subscription ? "Subscription" : "One-time"}</span>
          {subscription && (
            <Select value={p.billing_type} onValueChange={(v) => set("billing_type", v as Product["billing_type"])}>
              <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent>
            </Select>
          )}
        </div>
      </div>
      <Input placeholder="Short tagline" value={p.short_tagline ?? ""} maxLength={160} onChange={(e) => set("short_tagline", e.target.value)} aria-label="Short tagline" />
      <Textarea rows={5} placeholder="Full description (Markdown supported)" value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} aria-label="Description" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input placeholder="Add a feature bullet" value={feature} onChange={(e) => setFeature(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (feature.trim()) { set("features", [...(p.features ?? []), feature.trim()]); setFeature(""); } } }} aria-label="Feature" />
          <Button type="button" variant="outline" onClick={() => { if (feature.trim()) { set("features", [...(p.features ?? []), feature.trim()]); setFeature(""); } }}><Plus className="size-4" /></Button>
        </div>
        <ul className="space-y-1">{(p.features ?? []).map((f, i) => (
          <li key={i} className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-sm">{f}
            <button type="button" aria-label="Remove feature" onClick={() => set("features", (p.features ?? []).filter((_, j) => j !== i))}><X className="size-4 text-muted-foreground" /></button></li>
        ))}</ul>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <DropZone label="Drop cover image or click" icon={ImagePlus} accept="image/*" busy={uploading === "cover"} onFile={(f) => upload("cover", f)} current={p.cover_image_url ? "Cover uploaded" : null} />
        <DropZone label="Drop digital file (.xlsx, .zip, .pdf)" icon={FileUp} accept=".xlsx,.xls,.csv,.zip,.pdf,.docx" busy={uploading === "file"} onFile={(f) => upload("file", f)} current={p.downloadable_file_url} />
      </div>
      {needsUrl && <Input placeholder="External access URL (https://app...)" value={p.external_access_url ?? ""} onChange={(e) => set("external_access_url", e.target.value)} aria-label="External access URL" />}
      <Input placeholder="Public demo URL (optional)" value={p.demo_url ?? ""} onChange={(e) => set("demo_url", e.target.value)} aria-label="Demo URL" />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="size-4 animate-spin" />}Save product</Button>
      </div>
    </form>
  );
}

export function OrdersView() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useOrders();
  const { data: products } = useProducts();
  const [filter, setFilter] = useState<"all" | PayStatus>("all");
  const names = new Map((products ?? []).map((p) => [p.id, p.title]));
  const update = useMutation({
    mutationFn: async ({ id, s }: { id: string; s: PayStatus }) => { const { error } = await supabase.from("orders").update({ payment_status: s }).eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
  });
  const rows = (orders ?? []).filter((o) => filter === "all" || o.payment_status === filter);
  return (
    <div className="space-y-4">
      <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
        <SelectContent>{["all", "pending_verification", "paid", "failed", "refunded"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All orders" : s.replace("_", " ")}</SelectItem>)}</SelectContent>
      </Select>
      <div className={`${card} overflow-x-auto`}>
        {isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading…</p> : rows.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p> : (
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-border"><tr><th className={th}>Customer</th><th className={th}>Product</th><th className={th}>Amount</th><th className={th}>Method / Ref</th><th className={th}>Date</th><th className={th}>Status</th><th className={th}></th></tr></thead>
            <tbody className="divide-y divide-border">{rows.map((o) => (
              <tr key={o.id}>
                <td className={td}><p className="font-medium">{o.customer_name}</p><p className="text-xs text-muted-foreground">{o.customer_email}</p></td>
                <td className={td}>{(o.product_id && names.get(o.product_id)) ?? "—"}</td>
                <td className={td}>{o.currency} {Number(o.amount).toFixed(2)}</td>
                <td className={td}><p className="capitalize">{o.payment_method.replace("_", " ")}</p><p className="font-mono text-xs text-muted-foreground">{o.payment_reference ?? "—"}</p></td>
                <td className={`${td} whitespace-nowrap text-muted-foreground`}>{new Date(o.created_at).toLocaleString()}</td>
                <td className={td}>
                  <Select value={o.payment_status} onValueChange={(s) => update.mutate({ id: o.id, s: s as PayStatus })}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>{["pending_verification", "paid", "failed", "refunded"].map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className={td}>{o.payment_status === "pending_verification" && <Button size="sm" onClick={() => update.mutate({ id: o.id, s: "paid" })}><CheckCircle2 className="size-4" />Approve</Button>}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Customers check their order page and get their download as soon as you approve.</p>
    </div>
  );
}

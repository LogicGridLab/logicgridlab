import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const card = "rounded-2xl border border-border bg-card/60 backdrop-blur-xl";
const th = "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 align-top text-sm text-foreground";
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const PLATFORMS = ["etsy", "shopify", "producthunt", "futurepedia"];
const PLATFORM_LABEL: Record<string, string> = { etsy: "Etsy", shopify: "Shopify", producthunt: "Product Hunt", futurepedia: "Futurepedia", direct: "Direct", payoneer: "Payoneer", stripe: "Stripe" };

type Listing = { id: string; product_id: string | null; platform: string; listing_url: string; status: string; views: number; clicks: number; created_at: string };
type Sale = { id: string; product_id: string | null; customer_email: string; amount: number; platform: string; status: string; date: string };
type Edit = { id: string; client_name: string; website_url: string | null; task_type: string; description: string | null; status: string; budget: number | null; created_at: string };

function useProducts() {
  return useQuery({
    queryKey: ["portal-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id,title").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

function useRows<T>(table: "listings" | "sales" | "edit_requests", order: string) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(order, { ascending: false });
      if (error) throw error;
      return data as unknown as T[];
    },
  });
}

function useWrite(table: "listings" | "sales" | "edit_requests") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fn: () => PromiseLike<{ error: unknown }>) => {
      const { error } = await fn();
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [table] }); toast.success("Saved"); },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong"),
  });
}

function Pick({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  );
}

/* ---------- Overview widgets ---------- */
export function PortalOverview() {
  const sales = useRows<Sale>("sales", "date");
  const edits = useRows<Edit>("edit_requests", "created_at");
  const listings = useRows<Listing>("listings", "created_at");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const chart = days.map((d) => {
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const total = (sales.data ?? []).filter((s) => s.status === "paid" && new Date(s.date) >= d && new Date(s.date) < next).reduce((a, s) => a + Number(s.amount), 0);
    return { day: d.toLocaleDateString(undefined, { weekday: "short" }), total };
  });
  const paid = (sales.data ?? []).filter((s) => s.status === "paid");
  const stats = [
    { label: "Total Sales", value: money(paid.reduce((a, s) => a + Number(s.amount), 0)) },
    { label: "Active Listings", value: (listings.data ?? []).filter((l) => l.status === "active").length },
    { label: "Pending Edits", value: (edits.data ?? []).filter((e) => e.status === "pending").length },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-5`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${card} p-5`}>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Sales — last 7 days</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => money(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${card} p-5`}>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Recent edit requests</h3>
          {(edits.data ?? []).slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
              <span className="text-foreground">{e.client_name} <span className="text-muted-foreground">· {e.task_type}</span></span>
              <span className="text-xs text-muted-foreground">{e.status}</span>
            </div>
          ))}
          {!edits.data?.length && <p className="text-sm text-muted-foreground">No requests yet.</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Listings ---------- */
export function ListingsView() {
  const { data, isLoading } = useRows<Listing>("listings", "created_at");
  const products = useProducts();
  const write = useWrite("listings");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Partial<Listing>>({});
  const name = (id: string | null) => products.data?.find((p) => p.id === id)?.title ?? "—";

  const save = (e: FormEvent) => {
    e.preventDefault();
    const row = { product_id: edit.product_id ?? null, platform: edit.platform ?? "etsy", listing_url: edit.listing_url ?? "", status: edit.status ?? "active", views: Number(edit.views ?? 0), clicks: Number(edit.clicks ?? 0) };
    write.mutate(() => edit.id ? supabase.from("listings").update(row).eq("id", edit.id) : supabase.from("listings").insert(row), { onSuccess: () => setOpen(false) });
  };

  return (
    <div className={card}>
      <div className="flex items-center justify-between p-4">
        <p className="text-sm text-muted-foreground">Where your products are listed across marketplaces.</p>
        <Button size="sm" onClick={() => { setEdit({}); setOpen(true); }}><Plus /> Add listing</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead><tr className="border-y border-border"><th className={th}>Product</th><th className={th}>Platform</th><th className={th}>URL</th><th className={th}>Views</th><th className={th}>Clicks</th><th className={th}>Status</th><th className={th} /></tr></thead>
          <tbody>
            {data?.map((l) => (
              <tr key={l.id} className="border-b border-border">
                <td className={td}>{name(l.product_id)}</td>
                <td className={td}><span className="rounded-full border border-border px-2 py-0.5 text-xs">{PLATFORM_LABEL[l.platform] ?? l.platform}</span></td>
                <td className={td}><a href={l.listing_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Open <ExternalLink className="size-3" /></a></td>
                <td className={td}>{l.views}</td><td className={td}>{l.clicks}</td><td className={td}>{l.status}</td>
                <td className={`${td} text-right`}>
                  <Button size="sm" variant="ghost" onClick={() => { setEdit(l); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => confirm("Delete this listing?") && write.mutate(() => supabase.from("listings").delete().eq("id", l.id))}><Trash2 /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-foreground"><Loader2 className="mr-2 inline size-4 animate-spin" />Loading…</p>}
        {!isLoading && !data?.length && <p className="p-6 text-center text-sm text-muted-foreground">No listings yet.</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit.id ? "Edit listing" : "Add listing"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <Pick value={edit.product_id ?? ""} onChange={(v) => setEdit({ ...edit, product_id: v })} options={(products.data ?? []).map((p) => ({ value: p.id, label: p.title }))} />
            <Pick value={edit.platform ?? "etsy"} onChange={(v) => setEdit({ ...edit, platform: v })} options={PLATFORMS.map((p) => ({ value: p, label: PLATFORM_LABEL[p] }))} />
            <Input required type="url" placeholder="https://…" value={edit.listing_url ?? ""} onChange={(e) => setEdit({ ...edit, listing_url: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" min={0} placeholder="Views" value={edit.views ?? ""} onChange={(e) => setEdit({ ...edit, views: Number(e.target.value) })} />
              <Input type="number" min={0} placeholder="Clicks" value={edit.clicks ?? ""} onChange={(e) => setEdit({ ...edit, clicks: Number(e.target.value) })} />
            </div>
            <Pick value={edit.status ?? "active"} onChange={(v) => setEdit({ ...edit, status: v })} options={["active", "paused", "draft"].map((s) => ({ value: s, label: s }))} />
            <Button type="submit" className="w-full" disabled={write.isPending}>{write.isPending && <Loader2 className="animate-spin" />}Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Sales ---------- */
export function SalesView() {
  const { data, isLoading } = useRows<Sale>("sales", "date");
  const products = useProducts();
  const write = useWrite("sales");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product_id: "", customer_email: "", amount: "", platform: "etsy" });
  const name = (id: string | null) => products.data?.find((p) => p.id === id)?.title ?? "—";

  const exportCsv = () => {
    const rows = [["Date", "Product", "Customer", "Amount", "Platform", "Status"], ...(data ?? []).map((s) => [new Date(s.date).toISOString(), name(s.product_id), s.customer_email, String(s.amount), s.platform, s.status])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    write.mutate(() => supabase.from("sales").insert({ product_id: form.product_id || null, customer_email: form.customer_email, amount: Number(form.amount), platform: form.platform }), {
      onSuccess: () => { setOpen(false); setForm({ product_id: "", customer_email: "", amount: "", platform: "etsy" }); },
    });
  };

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <p className="text-sm text-muted-foreground">Sales from every platform in one place.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={!data?.length}><Download /> Export CSV</Button>
          <Button size="sm" onClick={() => setOpen(true)}><Plus /> Add sale</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead><tr className="border-y border-border"><th className={th}>Date</th><th className={th}>Product</th><th className={th}>Customer</th><th className={th}>Amount</th><th className={th}>Platform</th><th className={th}>Status</th><th className={th} /></tr></thead>
          <tbody>
            {data?.map((s) => (
              <tr key={s.id} className="border-b border-border">
                <td className={td}>{new Date(s.date).toLocaleDateString()}</td>
                <td className={td}>{name(s.product_id)}</td>
                <td className={td}>{s.customer_email}</td>
                <td className={td}>{money(Number(s.amount))}</td>
                <td className={td}>{PLATFORM_LABEL[s.platform] ?? s.platform}</td>
                <td className={td}><span className={s.status === "paid" ? "text-primary" : "text-muted-foreground"}>{s.status}</span></td>
                <td className={`${td} text-right`}>
                  {s.status === "paid" && <Button size="sm" variant="ghost" onClick={() => confirm("Mark as refunded?") && write.mutate(() => supabase.from("sales").update({ status: "refunded" }).eq("id", s.id))}>Refund</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-foreground"><Loader2 className="mr-2 inline size-4 animate-spin" />Loading…</p>}
        {!isLoading && !data?.length && <p className="p-6 text-center text-sm text-muted-foreground">No sales recorded yet.</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add sale</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <Pick value={form.product_id} onChange={(v) => setForm({ ...form, product_id: v })} options={(products.data ?? []).map((p) => ({ value: p.id, label: p.title }))} />
            <Input required type="email" placeholder="Customer email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
            <Input required type="number" min={0} step="0.01" placeholder="Amount (USD)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Pick value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} options={["etsy", "shopify", "direct", "payoneer", "stripe"].map((p) => ({ value: p, label: PLATFORM_LABEL[p] }))} />
            <Button type="submit" className="w-full" disabled={write.isPending}>{write.isPending && <Loader2 className="animate-spin" />}Save sale</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Edit requests (kanban) ---------- */
const COLUMNS = [{ key: "pending", label: "Pending" }, { key: "in-progress", label: "In progress" }, { key: "done", label: "Done" }];

export function EditsView() {
  const { data, isLoading } = useRows<Edit>("edit_requests", "created_at");
  const write = useWrite("edit_requests");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_name: "", website_url: "", task_type: "repair", description: "", budget: "" });

  const save = (e: FormEvent) => {
    e.preventDefault();
    write.mutate(() => supabase.from("edit_requests").insert({ ...form, budget: form.budget ? Number(form.budget) : null }), {
      onSuccess: () => { setOpen(false); setForm({ client_name: "", website_url: "", task_type: "repair", description: "", budget: "" }); },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button size="sm" onClick={() => setOpen(true)}><Plus /> New request</Button></div>
      {isLoading && <p className="text-sm text-muted-foreground"><Loader2 className="mr-2 inline size-4 animate-spin" />Loading…</p>}
      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = (data ?? []).filter((r) => r.status === col.key);
          return (
            <div key={col.key} className={`${card} p-4`}>
              <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-foreground">{col.label}<span className="text-xs text-muted-foreground">{items.length}</span></h3>
              <div className="space-y-3">
                {items.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border bg-background/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{r.client_name}</p>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">{r.task_type}</span>
                    </div>
                    {r.website_url && <a href={r.website_url} target="_blank" rel="noreferrer" className="block truncate text-xs text-primary hover:underline">{r.website_url}</a>}
                    {r.description && <p className="mt-2 text-xs text-muted-foreground">{r.description}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      {r.budget != null && <span className="text-xs text-foreground">{money(Number(r.budget))}</span>}
                      <div className="ml-auto w-32"><Pick value={r.status} onChange={(v) => write.mutate(() => supabase.from("edit_requests").update({ status: v }).eq("id", r.id))} options={COLUMNS.map((c) => ({ value: c.key, label: c.label }))} /></div>
                      <Button size="icon" variant="ghost" onClick={() => confirm("Delete request?") && write.mutate(() => supabase.from("edit_requests").delete().eq("id", r.id))}><Trash2 /></Button>
                    </div>
                  </div>
                ))}
                {!items.length && <p className="text-xs text-muted-foreground">Nothing here.</p>}
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New edit request</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <Input required placeholder="Client name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            <Input type="url" placeholder="https://client-site.com" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
            <Pick value={form.task_type} onChange={(v) => setForm({ ...form, task_type: v })} options={["design", "repair", "automation"].map((t) => ({ value: t, label: t }))} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input type="number" min={0} placeholder="Budget (USD)" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <Button type="submit" className="w-full" disabled={write.isPending}>{write.isPending && <Loader2 className="animate-spin" />}Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

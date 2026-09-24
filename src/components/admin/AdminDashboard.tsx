import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3, Bot, Inbox, LogOut, MessageSquare, Plus, Settings as SettingsIcon,
  CreditCard, Mail, MessageCircle, Loader2, ShieldCheck, Trash2, Pencil,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type InquiryStatus = "new" | "contacted" | "closed";
type SubStatus = "active" | "canceled" | "past_due";

type Inquiry = {
  id: string; created_at: string; name: string; email: string;
  phone: string | null; service_interest: string | null; message: string | null; status: InquiryStatus;
};
type Subscriber = {
  id: string; created_at: string; email: string; plan_name: string;
  status: SubStatus; stripe_customer_id: string | null; renews_at: string | null;
};
type Knowledge = {
  id: string; category: string; title: string; content: string; is_active: boolean; updated_at: string;
};
type ChatLog = {
  id: string; created_at: string; session_id: string; user_message: string;
  bot_response: string | null; visitor_contact: string | null;
};

const NAV = [
  { key: "overview", label: "Overview / Metrics", icon: BarChart3 },
  { key: "inquiries", label: "Leads & Inquiries", icon: Inbox },
  { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { key: "knowledge", label: "Chatbot Training", icon: Bot },
  { key: "logs", label: "Chat Logs", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: SettingsIcon },
] as const;

type NavKey = (typeof NAV)[number]["key"];

const fmt = (value: string | null) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const card = "rounded-2xl border border-border bg-card/60 backdrop-blur-xl";
const th = "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 align-top text-sm text-foreground";

export default function AdminDashboard({ email }: { email: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState<NavKey>("overview");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setIsAdmin(false); return; }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin");
      setIsAdmin(Boolean(roles && roles.length > 0));
    });
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" /> Checking access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className={`${card} max-w-md p-8 text-center`}>
          <ShieldCheck className="mx-auto mb-3 size-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email} is signed in but is not an authorized admin account.
          </p>
          <Button className="mt-5" variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 p-5 backdrop-blur-xl md:flex">
        <div className="mb-8 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="font-semibold tracking-tight text-foreground">LogicGridLab</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 border-t border-border pt-4">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-base font-semibold text-foreground">
              {NAV.find((item) => item.key === view)?.label}
            </h1>
            <div className="md:hidden">
              <Select value={view} onValueChange={(value) => setView(value as NavKey)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NAV.map((item) => <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <main className="space-y-6 p-5">
          {view === "overview" && <Overview onNavigate={setView} />}
          {view === "inquiries" && <Inquiries />}
          {view === "subscriptions" && <Subscriptions />}
          {view === "knowledge" && <KnowledgeCenter />}
          {view === "logs" && <ChatLogs />}
          {view === "settings" && <SettingsView email={email} onSignOut={signOut} />}
        </main>
      </div>
    </div>
  );
}

function useTable<T>(table: "inquiries" | "subscribers" | "bot_knowledge" | "chat_logs", orderBy: string) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function Loading() {
  return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</p>;
}

function Empty({ text }: { text: string }) {
  return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{text}</p>;
}

function Overview({ onNavigate }: { onNavigate: (key: NavKey) => void }) {
  const inquiries = useTable<Inquiry>("inquiries", "created_at");
  const subscribers = useTable<Subscriber>("subscribers", "created_at");
  const knowledge = useTable<Knowledge>("bot_knowledge", "updated_at");
  const logs = useTable<ChatLog>("chat_logs", "created_at");

  const stats = [
    { label: "New inquiries", value: inquiries.data?.filter((item) => item.status === "new").length ?? 0, hint: `${inquiries.data?.length ?? 0} total leads`, key: "inquiries" as NavKey },
    { label: "Active subscriptions", value: subscribers.data?.filter((item) => item.status === "active").length ?? 0, hint: `${subscribers.data?.length ?? 0} total clients`, key: "subscriptions" as NavKey },
    { label: "Active knowledge entries", value: knowledge.data?.filter((item) => item.is_active).length ?? 0, hint: `${knowledge.data?.length ?? 0} total entries`, key: "knowledge" as NavKey },
    { label: "Chat messages logged", value: logs.data?.length ?? 0, hint: "Last 200 records", key: "logs" as NavKey },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <button key={stat.label} type="button" onClick={() => onNavigate(stat.key)} className={`${card} p-5 text-left transition-colors hover:border-primary/40`}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </button>
        ))}
      </div>
      <div className={`${card} overflow-hidden`}>
        <h2 className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">Latest inquiries</h2>
        {inquiries.isLoading ? <div className="p-4"><Loading /></div> : (inquiries.data?.length ?? 0) === 0 ? <Empty text="No inquiries yet." /> : (
          <ul className="divide-y divide-border">
            {inquiries.data!.slice(0, 5).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{item.name} · {item.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.service_interest ?? "General enquiry"} · {fmt(item.created_at)}</p>
                </div>
                <StatusPill status={item.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: InquiryStatus | SubStatus }) {
  const tone: Record<string, string> = {
    new: "bg-primary/15 text-primary",
    contacted: "bg-amber-500/15 text-amber-400",
    closed: "bg-muted text-muted-foreground",
    active: "bg-emerald-500/15 text-emerald-400",
    canceled: "bg-muted text-muted-foreground",
    past_due: "bg-red-500/15 text-red-400",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${tone[status]}`}>{status.replace("_", " ")}</span>;
}

function Inquiries() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useTable<Inquiry>("inquiries", "created_at");
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) => {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  const rows = useMemo(
    () => (data ?? []).filter((item) => filter === "all" || item.status === filter),
    [data, filter],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "new", "contacted", "closed"].map((value) => (
              <SelectItem key={value} value={value}>{value === "all" ? "All statuses" : value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{rows.length} leads</span>
      </div>
      <div className={`${card} overflow-x-auto`}>
        {isLoading ? <div className="p-4"><Loading /></div> : rows.length === 0 ? <Empty text="No inquiries match this filter." /> : (
          <table className="w-full min-w-[820px] border-collapse">
            <thead className="border-b border-border">
              <tr><th className={th}>Lead</th><th className={th}>Interest</th><th className={th}>Message</th><th className={th}>Received</th><th className={th}>Status</th><th className={th}>Contact</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((item) => (
                <tr key={item.id}>
                  <td className={td}>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                    {item.phone && <p className="text-xs text-muted-foreground">{item.phone}</p>}
                  </td>
                  <td className={td}>{item.service_interest ?? "—"}</td>
                  <td className={`${td} max-w-xs`}><p className="line-clamp-3 text-muted-foreground">{item.message ?? "—"}</p></td>
                  <td className={`${td} whitespace-nowrap text-muted-foreground`}>{fmt(item.created_at)}</td>
                  <td className={td}>
                    <Select value={item.status} onValueChange={(status) => update.mutate({ id: item.id, status: status as InquiryStatus })}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["new", "contacted", "closed"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={td}>
                    <div className="flex gap-2">
                      {item.phone && (
                        <Button size="icon" variant="outline" asChild aria-label={`WhatsApp ${item.name}`}>
                          <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /></a>
                        </Button>
                      )}
                      <Button size="icon" variant="outline" asChild aria-label={`Email ${item.name}`}>
                        <a href={`mailto:${item.email}?subject=${encodeURIComponent("LogicGridLab — your enquiry")}`}><Mail className="size-4" /></a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Subscriptions() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useTable<Subscriber>("subscribers", "created_at");
  const [form, setForm] = useState({ email: "", plan_name: "", stripe_customer_id: "" });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("subscribers").insert({
        email: form.email.trim(),
        plan_name: form.plan_name.trim(),
        stripe_customer_id: form.stripe_customer_id.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ email: "", plan_name: "", stripe_customer_id: "" });
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubStatus }) => {
      const { error } = await supabase.from("subscribers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
  });

  return (
    <div className="space-y-4">
      <form
        className={`${card} grid gap-3 p-4 md:grid-cols-4`}
        onSubmit={(event: FormEvent) => { event.preventDefault(); add.mutate(); }}
      >
        <Input required type="email" placeholder="Client email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input required placeholder="Plan name" value={form.plan_name} onChange={(e) => setForm({ ...form, plan_name: e.target.value })} />
        <Input placeholder="Stripe customer ID (optional)" value={form.stripe_customer_id} onChange={(e) => setForm({ ...form, stripe_customer_id: e.target.value })} />
        <Button type="submit" disabled={add.isPending}><Plus className="size-4" /> Add subscriber</Button>
      </form>
      <div className={`${card} overflow-x-auto`}>
        {isLoading ? <div className="p-4"><Loading /></div> : (data?.length ?? 0) === 0 ? <Empty text="No subscribers yet." /> : (
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="border-b border-border">
              <tr><th className={th}>Client</th><th className={th}>Plan</th><th className={th}>Started</th><th className={th}>Renews</th><th className={th}>Stripe ID</th><th className={th}>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data!.map((item) => (
                <tr key={item.id}>
                  <td className={td}>{item.email}</td>
                  <td className={td}>{item.plan_name}</td>
                  <td className={`${td} whitespace-nowrap text-muted-foreground`}>{fmt(item.created_at)}</td>
                  <td className={`${td} whitespace-nowrap text-muted-foreground`}>{fmt(item.renews_at)}</td>
                  <td className={`${td} text-muted-foreground`}>{item.stripe_customer_id ?? "—"}</td>
                  <td className={td}>
                    <Select value={item.status} onValueChange={(status) => update.mutate({ id: item.id, status: status as SubStatus })}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["active", "canceled", "past_due"].map((value) => <SelectItem key={value} value={value}>{value.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const emptyEntry = { id: "", category: "FAQ", title: "", content: "" };

function KnowledgeCenter() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useTable<Knowledge>("bot_knowledge", "updated_at");
  const [entry, setEntry] = useState(emptyEntry);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["bot_knowledge"] });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { category: entry.category.trim() || "general", title: entry.title.trim(), content: entry.content.trim() };
      const { error } = entry.id
        ? await supabase.from("bot_knowledge").update(payload).eq("id", entry.id)
        : await supabase.from("bot_knowledge").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { setEntry(emptyEntry); invalidate(); },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("bot_knowledge").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bot_knowledge").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
      <form
        className={`${card} h-fit space-y-3 p-5`}
        onSubmit={(event: FormEvent) => { event.preventDefault(); save.mutate(); }}
      >
        <h2 className="text-sm font-medium text-foreground">{entry.id ? "Edit entry" : "Add knowledge entry"}</h2>
        <Input placeholder="Category (FAQ, Policy, Pricing…)" value={entry.category} onChange={(e) => setEntry({ ...entry, category: e.target.value })} />
        <Input required placeholder="Question or title" value={entry.title} onChange={(e) => setEntry({ ...entry, title: e.target.value })} />
        <Textarea required rows={6} placeholder="Answer the chatbot should give" value={entry.content} onChange={(e) => setEntry({ ...entry, content: e.target.value })} />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={save.isPending}>{entry.id ? "Save changes" : "Add entry"}</Button>
          {entry.id && <Button type="button" variant="outline" onClick={() => setEntry(emptyEntry)}>Cancel</Button>}
        </div>
      </form>
      <div className={`${card} overflow-hidden`}>
        {isLoading ? <div className="p-4"><Loading /></div> : (data?.length ?? 0) === 0 ? <Empty text="No knowledge entries yet." /> : (
          <ul className="divide-y divide-border">
            {data!.map((item) => (
              <li key={item.id} className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.category}</p>
                    <p className="font-medium text-foreground">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.is_active} onCheckedChange={(is_active) => toggle.mutate({ id: item.id, is_active })} aria-label={`Toggle ${item.title}`} />
                    <Button size="icon" variant="outline" aria-label={`Edit ${item.title}`} onClick={() => setEntry({ id: item.id, category: item.category, title: item.title, content: item.content })}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="outline" aria-label={`Delete ${item.title}`} onClick={() => remove.mutate(item.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{item.content}</p>
                <p className="text-xs text-muted-foreground">Updated {fmt(item.updated_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ChatLogs() {
  const { data, isLoading } = useTable<ChatLog>("chat_logs", "created_at");
  return (
    <div className={`${card} overflow-hidden`}>
      {isLoading ? <div className="p-4"><Loading /></div> : (data?.length ?? 0) === 0 ? <Empty text="No chatbot conversations recorded yet." /> : (
        <ul className="divide-y divide-border">
          {data!.map((item) => (
            <li key={item.id} className="space-y-2 p-4">
              <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                <span>Session {item.session_id.slice(0, 12)}</span>
                <span>{fmt(item.created_at)}{item.visitor_contact ? ` · ${item.visitor_contact}` : ""}</span>
              </div>
              <p className="rounded-xl bg-muted/40 p-3 text-sm text-foreground">{item.user_message}</p>
              <p className="rounded-xl border border-border p-3 text-sm text-muted-foreground">{item.bot_response ?? "No response recorded"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SettingsView({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [password, setPassword] = useState("");
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password, current_password: current } as never);
    setSaving(false);
    setMessage(error ? error.message : "Password updated.");
    if (!error) { setPassword(""); setCurrent(""); }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={`${card} p-5`}>
        <h2 className="text-sm font-medium text-foreground">Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p>
        <p className="mt-1 text-xs text-muted-foreground">Admin access is granted per account. Ask an existing admin to authorize new team members.</p>
        <Button variant="outline" className="mt-4" onClick={onSignOut}><LogOut className="size-4" /> Sign out</Button>
      </div>
      <form className={`${card} space-y-3 p-5`} onSubmit={changePassword}>
        <h2 className="text-sm font-medium text-foreground">Change password</h2>
        <Input type="password" required placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        <Input type="password" required minLength={8} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="size-4 animate-spin" />} Update password</Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </form>
    </div>
  );
}

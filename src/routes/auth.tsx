import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — LogicGridLab" },
      { name: "description", content: "Secure sign-in for the LogicGridLab admin dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — LogicGridLab" },
      { property: "og:description", content: "Secure sign-in for the LogicGridLab admin dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage(error.message);
      navigate({ to: "/admin", replace: true });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) return setMessage(error.message);
    if (data.session) {
      navigate({ to: "/admin", replace: true });
      return;
    }
    setMessage("Check your inbox and confirm your email address to activate the account.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card/70 p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl border border-border bg-background">
            <Lock className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-foreground">LogicGridLab Admin</h1>
            <p className="text-xs text-muted-foreground">Authorized accounts only</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input type="email" required placeholder="you@logicgridlab.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Input type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(null); }}
        >
          {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}

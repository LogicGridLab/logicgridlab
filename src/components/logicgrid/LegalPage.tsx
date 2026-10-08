import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function legalHead(path: string, title: string, description: string) {
  const url = `https://logicgridlab.com${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function LegalLayout({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-20 text-foreground">
      <article className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-primary-soft">← Back to LogicGridLab</Link>
        <p className="eyebrow mt-12"><span />Legal</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        {updated && <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>}
        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">{children}</div>
        <nav className="mt-16 flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
          <Link to="/terms" className="text-primary-soft">Terms</Link>
          <Link to="/privacy" className="text-primary-soft">Privacy</Link>
          <Link to="/refund" className="text-primary-soft">Refund Policy</Link>
          <Link to="/contact" className="text-primary-soft">Contact</Link>
        </nav>
      </article>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>{children}</section>;
}

export const Mail = () => <a className="text-primary-soft" href="mailto:info@logicgridlab.com">info@logicgridlab.com</a>;

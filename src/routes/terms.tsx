import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — LogicGridLab" },
      { name: "description", content: "General terms for LogicGridLab software products and professional services." },
      { property: "og:title", content: "Terms of Service — LogicGridLab" },
      { property: "og:description", content: "General terms for LogicGridLab software products and professional services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20 text-foreground">
      <article className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-primary-soft">← Back to LogicGridLab</Link>
        <p className="eyebrow mt-12"><span />Legal</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Terms of Service</h1>
        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">Project agreements</h2><p>Project scope, schedule, payment terms, deliverables, and support arrangements are confirmed in writing before work begins.</p></section>
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">Software products</h2><p>Product access and updates are provided according to the terms shown at purchase. Third-party platforms remain subject to their own terms and availability.</p></section>
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">Contact</h2><p>For questions about these terms, email <a className="text-primary-soft" href="mailto:info@logicgridlab.com">info@logicgridlab.com</a>.</p></section>
        </div>
      </article>
    </main>
  );
}
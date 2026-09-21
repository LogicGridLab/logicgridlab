import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LogicGridLab" },
      { name: "description", content: "How LogicGridLab handles website and project enquiry information." },
      { property: "og:title", content: "Privacy Policy — LogicGridLab" },
      { property: "og:description", content: "How LogicGridLab handles website and project enquiry information." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://logicgridlab.com/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://logicgridlab.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20 text-foreground">
      <article className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-primary-soft">← Back to LogicGridLab</Link>
        <p className="eyebrow mt-12"><span />Legal</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">Information you share</h2><p>When you contact LogicGridLab, we receive the details you provide, such as your name, business, email address, and project message.</p></section>
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">How information is used</h2><p>We use enquiry information only to respond, understand your requirements, prepare proposals, and deliver requested services. We do not sell personal information.</p></section>
          <section><h2 className="mb-2 text-lg font-semibold text-foreground">Contact</h2><p>For privacy questions or deletion requests, email <a className="text-primary-soft" href="mailto:info@logicgridlab.com">info@logicgridlab.com</a>.</p></section>
        </div>
      </article>
    </main>
  );
}
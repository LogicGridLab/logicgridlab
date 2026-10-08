import { createFileRoute, Link } from "@tanstack/react-router";
import { Contact } from "@/components/logicgrid/HomePage";
import { legalHead } from "@/components/logicgrid/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => legalHead("/contact", "Contact LogicGridLab — Gujranwala HQ, Global Delivery", "Contact LogicGridLab by email, WhatsApp or the project form. Gujranwala, Punjab, Pakistan — serving clients worldwide."),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 pt-20">
        <Link to="/" className="text-sm text-primary-soft">← Back to LogicGridLab</Link>
        <h1 className="mt-10 font-display text-4xl font-semibold sm:text-5xl">Contact LogicGridLab</h1>
        <div className="mt-8 grid gap-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          <div><h2 className="font-semibold text-foreground">Email</h2><a className="text-primary-soft" href="mailto:info@logicgridlab.com">info@logicgridlab.com</a></div>
          <div><h2 className="font-semibold text-foreground">WhatsApp</h2><a className="text-primary-soft" href="https://wa.me/923414249678" target="_blank" rel="noreferrer">+92-341-4249678</a></div>
          <div><h2 className="font-semibold text-foreground">Location</h2><p>Gujranwala, Punjab, Pakistan — Global Delivery</p></div>
          <div><h2 className="font-semibold text-foreground">Business hours</h2><p>Mon–Sat, 10:00–19:00 PKT (UTC+5)<br />WhatsApp support 24/7</p></div>
        </div>
      </div>
      <Contact />
    </main>
  );
}

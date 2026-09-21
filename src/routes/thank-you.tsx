import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Purchase Confirmed — LogicGridLab" },
      { name: "description", content: "Your LogicGridLab purchase has been confirmed." },
      { property: "og:title", content: "Purchase Confirmed — LogicGridLab" },
      { property: "og:description", content: "Your LogicGridLab purchase has been confirmed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return <main className="thank-you-page"><div className="thank-you-card"><div className="thank-you-icon"><CheckCircle2/></div><p className="eyebrow"><span/>Payment confirmed</p><h1>Welcome to LogicGridLab.</h1><p>Your receipt and product access instructions are on their way to the email used at checkout.</p><div className="thank-you-note"><Mail/><span><strong>Check your inbox</strong><small>Delivery can take a few minutes.</small></span></div><Button variant="premium" size="premium" asChild><Link to="/">Return to LogicGridLab <ArrowRight/></Link></Button></div></main>;
}

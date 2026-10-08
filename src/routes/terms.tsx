import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section, Mail, legalHead } from "@/components/logicgrid/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => legalHead("/terms", "Terms of Service — LogicGridLab", "Terms for LogicGridLab micro-SaaS tools including EtsyOps: licensing, LemonSqueezy payments, subscriptions and liability."),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="October 8, 2026">
      <Section title="1. Introduction"><p>LogicGridLab (Pvt) Ltd ("LogicGridLab", "we", "us") provides micro-SaaS tools such as EtsyOps, Contractor OS and related web applications and services. By purchasing, accessing or using our products you agree to these Terms. If you do not agree, do not use our products.</p></Section>
      <Section title="2. License"><p>On purchase you receive a personal, non-transferable, non-exclusive, revocable license to access the hosted SaaS product using the license key issued through LemonSqueezy. The license is for your own business use and does not transfer ownership of any software.</p></Section>
      <Section title="3. Payments via LemonSqueezy"><p>All payments are processed by LemonSqueezy, our Merchant of Record and third-party reseller, which handles billing, taxes and invoices. Standard pricing is $24 per month, $228 per year, or $149 for a lifetime license, unless a different price is shown at checkout. Prices may change for new purchases; existing terms are honoured for the active billing period.</p></Section>
      <Section title="4. Subscriptions & Cancellation"><p>Monthly and annual subscriptions renew automatically at the end of each billing period until cancelled. You can cancel at any time through the LemonSqueezy customer portal linked in your receipt email. After cancellation you keep access until the end of the paid period. Refunds are covered by our <a className="text-primary-soft" href="/refund">Refund Policy</a>.</p></Section>
      <Section title="5. Intellectual Property"><p>LogicGridLab owns all rights to the software, code, design, branding and documentation. You retain full ownership of your data, including your Etsy shop data, orders, listings and any information you enter.</p></Section>
      <Section title="6. Etsy API & Third-party Platforms"><p>Some products connect to Etsy and other third-party platforms. Your use of those platforms is subject to their own terms. The term "Etsy" is a trademark of Etsy, Inc.; our products are not endorsed or certified by Etsy. We are not responsible for downtime, API changes, rate limits or policy changes made by Etsy or any third party.</p></Section>
      <Section title="7. Prohibited Uses"><p>You may not resell, sublicense, share or distribute your license key; reverse engineer, decompile or copy the software; use the products for unlawful activity, spam or to violate any platform's terms; or attempt to disrupt or gain unauthorised access to our systems. We may suspend licenses that violate these rules.</p></Section>
      <Section title="8. Limitation of Liability"><p>Products are provided "as is" without warranties of any kind. To the maximum extent permitted by law, LogicGridLab is not liable for indirect, incidental or consequential damages, lost profits or lost data. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.</p></Section>
      <Section title="9. Governing Law & Contact"><p>These Terms are governed by the laws of Pakistan, with courts in Punjab having jurisdiction. Questions about these Terms: <Mail />.</p></Section>
    </LegalLayout>
  );
}

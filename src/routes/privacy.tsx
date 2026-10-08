import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section, Mail, legalHead } from "@/components/logicgrid/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead("/privacy", "Privacy Policy — LogicGridLab", "What data LogicGridLab collects, how it is stored, which third parties process it, and your rights."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 8, 2026">
      <Section title="1. What We Collect"><ul className="list-disc space-y-1 pl-5"><li>Account details such as your email address.</li><li>Payment information, processed by LemonSqueezy. We never see or store your card details.</li><li>Etsy shop data accessed through the Etsy API with your permission (orders, listings) and expenses or other data you enter.</li><li>Usage logs such as pages used, errors and device information.</li><li>Essential cookies needed to keep you signed in.</li></ul></Section>
      <Section title="2. How We Store Data"><p>Data is stored with Supabase (encrypted at rest and in transit) and served through Cloudflare. We keep your data until you delete your account or ask us to remove it.</p></Section>
      <Section title="3. Third Parties"><p>We share data only with providers needed to run our service: LemonSqueezy (Merchant of Record and payments), Cloudflare Pages (hosting), Supabase (database and authentication), and the Etsy API (shop connection). We do not sell your personal information.</p></Section>
      <Section title="4. Cookies"><p>We use only essential cookies for sign-in and security. We do not use advertising cookies.</p></Section>
      <Section title="5. Your Rights"><p>You can ask to access, correct, export or delete your data by emailing <Mail />. We respond within 30 days.</p></Section>
      <Section title="6. Data Retention & Security"><p>We retain data only as long as needed to provide the service or meet legal obligations. We use encryption, access controls and least-privilege permissions. No system is completely secure, but we work to protect your data and will notify you of any breach affecting it.</p></Section>
      <Section title="7. Contact"><p>LogicGridLab (Pvt) Ltd, Gujranwala HQ, Punjab, Pakistan<br />Email: <Mail /><br />Phone / WhatsApp: <a className="text-primary-soft" href="tel:+923414249678">+92-341-4249678</a></p></Section>
    </LegalLayout>
  );
}

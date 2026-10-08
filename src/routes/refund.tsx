import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section, Mail, legalHead } from "@/components/logicgrid/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => legalHead("/refund", "Refund Policy — LogicGridLab", "14-day refund policy for LogicGridLab SaaS products like EtsyOps, and how to request a refund."),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="October 8, 2026">
      <Section title="1. SaaS Products (EtsyOps and others)"><ul className="list-disc space-y-1 pl-5"><li>You can request a refund within 14 days of purchase if the product does not work as described and Pro features have not been heavily used.</li><li>Lifetime licenses ($149) are refundable within 14 days, minus LemonSqueezy processing fees (about 5%).</li><li>Monthly subscriptions can be cancelled anytime. You keep access until the end of the current period; partial months are not refunded.</li></ul></Section>
      <Section title="2. How to Request a Refund"><p>Email <Mail /> with your order ID, license key and the reason for the request. Approved refunds are processed within 5–7 business days through LemonSqueezy to your original payment method.</p></Section>
      <Section title="3. Non-refundable Cases"><p>Refunds are not available for abuse or violation of our <a className="text-primary-soft" href="/terms">Terms of Service</a>, requests made after 14 days, or lifetime licenses used for more than 30 days.</p></Section>
      <Section title="Contact"><p>Questions about refunds: <Mail />.</p></Section>
    </LegalLayout>
  );
}

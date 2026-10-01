import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CheckCircle2, Clock, Download, ExternalLink, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderStatus } from "@/lib/store.functions";

export const Route = createFileRoute("/order/$id")({
  ssr: false,
  validateSearch: z.object({ email: z.string().catch("") }),
  head: () => ({
    meta: [
      { title: "Your Order — LogicGridLab" },
      { name: "description", content: "Check your LogicGridLab order status and download your purchase." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Order — LogicGridLab" },
      { property: "og:description", content: "Order status and secure download." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { email } = Route.useSearch();
  const fetchStatus = useServerFn(getOrderStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["order", id, email],
    queryFn: () => fetchStatus({ data: { orderId: id, email } }),
    refetchInterval: (q) => (q.state.data && "status" in q.state.data && q.state.data.status === "pending_verification" ? 30000 : false),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-xl">
        {isLoading ? <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" /> : !data?.found ? (
          <><XCircle className="mx-auto size-10 text-destructive" /><h1 className="mt-4 text-2xl font-semibold">Order not found</h1><p className="mt-2 text-sm text-muted-foreground">Check the link from your checkout.</p></>
        ) : data.status === "paid" ? (
          <>
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">Payment confirmed</h1>
            <p className="mt-2 text-sm text-muted-foreground">Thank you! Your {data.productTitle} is ready.</p>
            <div className="mt-6 flex flex-col gap-2">
              {data.downloadUrl && <Button variant="premium" asChild><a href={data.downloadUrl}><Download />Download file</a></Button>}
              {data.accessUrl && <Button variant="glass" asChild><a href={data.accessUrl} target="_blank" rel="noreferrer"><ExternalLink />Open {data.productTitle}</a></Button>}
            </div>
          </>
        ) : data.status === "pending_verification" ? (
          <>
            <Clock className="mx-auto size-10 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">Verifying your payment</h1>
            <p className="mt-2 text-sm text-muted-foreground">We're checking your payment for {data.productTitle}. Bookmark this page — your download appears here once approved (usually within a few hours).</p>
          </>
        ) : (
          <><XCircle className="mx-auto size-10 text-destructive" /><h1 className="mt-4 text-2xl font-semibold">Payment {data.status}</h1><p className="mt-2 text-sm text-muted-foreground">Please contact us on WhatsApp for help.</p></>
        )}
        <Link to="/" className="mt-8 inline-block text-sm text-muted-foreground underline">Back to LogicGridLab</Link>
      </div>
    </main>
  );
}

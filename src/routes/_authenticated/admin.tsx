import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — LogicGridLab" },
      { name: "description", content: "Manage leads, subscriptions, chatbot training and chat logs for LogicGridLab." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — LogicGridLab" },
      { property: "og:description", content: "Internal control centre for LogicGridLab operations." },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { user } = Route.useRouteContext();
  return <AdminDashboard email={user.email ?? "Unknown account"} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/logicgrid/HomePage";

const title = "LogicGridLab — Premium SaaS Lab | WebApps, AI Agents & Website Growth";
const description = "LogicGridLab is a premium software product lab in Gujranwala building SaaS, high-performance websites, AI voice agents, and automation for businesses worldwide.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://logicgridlab.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://logicgridlab.com/" }],
  }),
  component: HomePage,
});

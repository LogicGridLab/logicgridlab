import { SiNextdotjs, SiReact, SiTypescript, SiSupabase, SiCloudflare, SiStripe } from "react-icons/si";
import { RiOpenaiFill, RiLinkedinFill } from "react-icons/ri";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ProductStore from "./ProductStore";
import { supabase } from "@/integrations/supabase/client";
import sirEjazAsset from "@/assets/sir-ejaz.jpg";
import ejazAsset from "@/assets/ejaz.jpg";
import ceoAsset from "@/assets/ceo.jpg";
import headsMeetingAsset from "@/assets/Heads-meeting.jpg";
import leadsMeetingAsset from "@/assets/leads-meeting.jpg";
import clientMeetingAsset from "@/assets/meeting-with-Lee.jpg";
import annualMeetingAsset from "@/assets/Staff-Annual-Meeting.jpg";
import awardsAsset from "@/assets/Awards.jpg";
import groupPhotoAsset from "@/assets/group-photo.jpg";
import trademarkAsset from "@/assets/logicgrid-trademark.png";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Gauge,
  Globe2,
  Headphones,
  Layers3,
  Mail,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  PhoneCall,
  Play,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";

const whatsappUrl = "https://wa.me/923414249678";
const whatsappDemoUrl = `${whatsappUrl}?text=${encodeURIComponent("Hi LogicGridLab, I would like to schedule a demo of your AI Voice Agent.")}`;
const etsyShopUrl = "https://www.etsy.com/shop/logicgridlab";
const invoiceUrl = (service: string) => `${whatsappUrl}?text=${encodeURIComponent(`Hi LogicGridLab, I would like to pay with Stripe and receive an official invoice for ${service}.`)}`;
const emailSchema = z.string().trim().email().max(255);

const navItems = [
  ["Products", "products"],
  ["Services", "services"],
  ["AI Agents", "ai-agents"],
  ["Showcase", "showcase"],
  ["Pricing", "pricing"],
  ["About Lab", "about"],
];

const services = [
  {
    icon: Code2,
    index: "01",
    kicker: "Product Engineering",
    title: "Custom WebApp & SaaS Development",
    copy: "From a focused MVP to a durable product system engineered for scale.",
    features: ["Multi-tenant SaaS", "Analytics dashboards", "Etsy & Shopify APIs", "Admin systems"],
    price: "From $1,499",
  },
  {
    icon: Gauge,
    index: "02",
    kicker: "Growth Systems",
    title: "Website Design, Revamp + SEO",
    copy: "Turn slow, dated websites into fast Next.js conversion machines.",
    features: ["95+ speed target", "Technical SEO", "Conversion design", "Schema & analytics"],
    price: "From $499",
  },
  {
    icon: ShieldCheck,
    index: "03",
    kicker: "Always-On Support",
    title: "Maintenance, Repair & Care Plans",
    copy: "A dependable technical team keeping your website secure and effective.",
    features: ["Updates & backups", "Uptime monitoring", "Priority bug fixes", "Monthly speed checks"],
    price: "From $49/mo",
  },
  {
    icon: Bot,
    index: "04",
    kicker: "AI Automation Lab",
    title: "AI Voice, Chat & WhatsApp Agents",
    copy: "Always-on AI systems that respond, qualify, schedule, and follow up.",
    features: ["Vapi & Retell voice", "OpenAI & Claude chat", "WhatsApp automation", "Lead qualification"],
    price: "From $699",
    hot: true,
  },
];

const products = [
  {
    number: "01",
    name: "EtsyOps",
    category: "Multi-Shop Analytics",
    price: "$39",
    cadence: "Lifetime",
    status: "Live Bestseller",
    copy: "One command center for revenue, fees, profit, listings, and ad spend across every Etsy shop.",
    metric: "120+ sellers",
    featured: true,
    app: "https://etsyops.logicgridlab.com",
  },
  {
    number: "02",
    name: "ShopSync",
    category: "Etsy + Shopify Sync",
    price: "$29",
    cadence: "Pre-order",
    status: "Pre-order",
    copy: "Keep inventory and orders synchronized across Etsy and Shopify without overselling.",
    metric: "Q4 release",
    app: "https://shopsync.logicgridlab.com",
  },
  {
    number: "03",
    name: "ListRank",
    category: "AI SEO Optimizer",
    price: "$19",
    cadence: "Early access",
    status: "Early Access",
    copy: "Find stronger keywords and turn them into optimized Etsy titles, tags, and listings.",
    metric: "AI-assisted",
    app: "https://listrank.logicgridlab.com",
  },
  {
    number: "04",
    name: "ReviewBoost",
    category: "Review Automation",
    price: "$49",
    cadence: "Lifetime",
    status: "Roadmap",
    copy: "Build thoughtful, policy-aware post-purchase journeys that earn more customer feedback.",
    metric: "Coming next",
    app: "https://reviewboost.logicgridlab.com",
  },
];

const caseStudies = [
  {
    icon: Gauge,
    tag: "Website Revamp",
    title: "Slow WordPress to a 98 performance score",
    copy: "A commerce site rebuilt around speed, technical SEO, and clearer conversion paths.",
    before: "42",
    after: "98",
    metric: "PageSpeed",
  },
  {
    icon: BarChart3,
    tag: "SaaS Product",
    title: "EtsyOps returns 10 hours every week",
    copy: "Scattered shop data became one live operating dashboard for independent sellers.",
    before: "10h",
    after: "1 view",
    metric: "Weekly reporting",
  },
  {
    icon: Bot,
    tag: "AI Automation",
    title: "Every lead answered, even after hours",
    copy: "An AI qualification workflow routes high-intent enquiries to the right next step.",
    before: "8h",
    after: "24/7",
    metric: "Response window",
  },
];

const plans = [
  {
    name: "Starter Care",
    price: "$49",
    suffix: "/month",
    copy: "Reliable maintenance for an established business website.",
    features: ["Updates & backups", "Uptime monitoring", "2 support hours", "Monthly health report"],
  },
  {
    name: "Growth Revamp",
    price: "$499",
    suffix: "one-time",
    copy: "A focused conversion and performance rebuild for growing brands.",
    features: ["Premium redesign", "95+ speed target", "Technical SEO", "Lead capture system"],
    popular: true,
  },
  {
    name: "Custom SaaS",
    price: "$1,499+",
    suffix: "project",
    copy: "A production-ready web application built around your business logic.",
    features: ["Product strategy", "Custom dashboard", "Secure user accounts", "Launch support"],
  },
];

const testimonials = [
  { quote: "EtsyOps saved me 10 hours a week. Finally I see real profit after Etsy fees.", name: "Sarah M.", role: "Handmade Jewelry · USA" },
  { quote: "LogicGridLab delivered my website in five days. Our SEO score went from 42 to 98.", name: "Ahmed K.", role: "Shopify Store Owner · UK" },
  { quote: "Professional team, and the WhatsApp support is instant. It feels like working with a real product company.", name: "Fatima S.", role: "Digital Products · UAE" },
  { quote: "We launched faster than planned, and the product has been rock solid from day one.", name: "Daniel R.", role: "E-commerce Founder · Canada" },
];

const faqs = [
  ["How quickly can you ship a project?", "Focused websites and MVPs typically ship in 7–14 days once scope, assets, and feedback windows are confirmed. Larger SaaS systems are planned in clear product milestones."],
  ["Do you work with clients outside Pakistan?", "Yes. LogicGridLab operates from Gujranwala HQ and serves businesses globally through structured remote delivery and direct WhatsApp communication."],
  ["What happens after launch?", "Every build includes a defined launch handover. Ongoing care plans can cover monitoring, backups, updates, bug fixes, and priority improvements."],
  ["How do payments and invoices work?", "EtsyOps is available through our official Etsy shop. For services, request an invoice and we will send a secure Stripe Payment Link with an official invoice before work begins."],
  ["Can an AI agent use my existing website and tools?", "Usually, yes. We can connect voice, chat, WhatsApp, CRM, calendars, and workflow tools after reviewing their available integrations and permissions."],
  ["Will an AI agent replace my team?", "The goal is to remove repetitive response and qualification work. Your team stays in control while the agent handles routine conversations and routes important cases."],
];

const linkedinUrl = "https://www.linkedin.com/company/logicgridlab";
const techStack = [
  { name: "Next.js", Icon: SiNextdotjs }, { name: "React", Icon: SiReact }, { name: "TypeScript", Icon: SiTypescript },
  { name: "Supabase", Icon: SiSupabase }, { name: "Cloudflare", Icon: SiCloudflare }, { name: "OpenAI", Icon: RiOpenaiFill }, { name: "Stripe", Icon: SiStripe },
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

function Brand() {
  return (
    <a href="#top" className="brand" aria-label="LogicGridLab home">
      <span className="brand-mark"><img src={trademarkAsset} width={72} height={72} alt="LogicGridLab logo" /></span>
      <span>LogicGrid<span>Lab</span></span><i />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container-site header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, id]) => <a key={label} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <a href="#products" className="login-link">Login</a>
          <Button variant="premium" asChild><a href="#contact">Start Project <ArrowRight /></a></Button>
        </div>
        <Button variant="glass" size="icon" className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(([label, id]) => <a key={label} href={`#${id}`} onClick={() => setOpen(false)}>{label}<ChevronRight /></a>)}
        <Button variant="premium" size="premium" asChild><a href="#contact" onClick={() => setOpen(false)}>Start Project <ArrowRight /></a></Button>
      </nav>}
    </header>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}

function SectionHeading({ eyebrow, title, copy, centered = false }: { eyebrow: string; title: string; copy?: string; centered?: boolean }) {
  return <div className={`section-heading ${centered ? "centered" : ""}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function DashboardMockup() {
  return (
    <div className="dashboard-stage" aria-label="EtsyOps analytics dashboard preview">
      <div className="dashboard-glow" />
      <div className="dashboard-window">
        <div className="browser-bar"><div className="browser-dots"><i /><i /><i /></div><div className="browser-url"><ShieldCheck />etsyops.logicgridlab.com/dashboard</div></div><div className="dashboard-topbar"><div className="mini-brand"><span>LG</span><strong>EtsyOps</strong></div></div>
        <div className="dashboard-body">
          <aside><span className="active"><BarChart3 />Overview</span><span><ShoppingBag />Orders</span><span><TrendingUp />Profit</span><span><Layers3 />Listings</span></aside>
          <div className="dashboard-main">
            <div className="dash-heading"><div><small>Good evening, Ejaz</small><strong>Store overview</strong></div><span>Last 30 days</span></div>
            <div className="metric-row">
              <div><small>Revenue</small><strong>$24,860</strong><em>+18.4%</em></div>
              <div><small>Net profit</small><strong>$8,492</strong><em>+12.8%</em></div>
              <div><small>Orders</small><strong>1,284</strong><em>+9.6%</em></div>
            </div>
            <div className="chart-panel"><div className="chart-head"><div><small>Revenue</small><strong>$24.8K</strong></div><span>Revenue <i /></span></div><div className="chart-grid"><svg viewBox="0 0 600 180" role="img" aria-label="Rising revenue chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".32"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path className="chart-area" d="M0,150 C70,145 80,110 150,120 C220,132 240,76 310,91 C370,103 410,45 470,62 C530,77 548,27 600,22 L600,180 L0,180 Z"/><path className="chart-line" d="M0,150 C70,145 80,110 150,120 C220,132 240,76 310,91 C370,103 410,45 470,62 C530,77 548,27 600,22"/></svg></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="hero section-grid">
      <div className="container-site hero-grid-layout">
        <div className="hero-copy">
          <div className="live-pill"><i />Gujranwala HQ • Serving 15+ Countries • Since 2021</div>
          <h1>We Build WebApps, SaaS & AI Automation <span className="hero-sub-head">That Print Revenue.</span></h1>
          <p>We transform Etsy sellers, Shopify brands and startups into high-converting products. 7-day MVP delivery, lifetime support, no agency fluff.</p>
          <div className="hero-actions">
            <Button variant="premium" size="premium" className="cta-whatsapp" asChild><a href={whatsappUrl} target="_blank" rel="noreferrer">Book Free Strategy Call → WhatsApp</a></Button>
            <Button variant="glass" size="premium" asChild><a href="#products">See Our Products <ArrowDown /></a></Button>
          </div>
          <div className="stack-proof"><small>Built with modern stack</small><div>{techStack.map(({ name, Icon }) => <span key={name} title={name}><Icon aria-hidden="true" />{name}</span>)}</div></div>
          <div className="hero-founder"><span className="hero-founder-ring"><img src={sirEjazAsset} width={112} height={112} alt="Ejaz Ahmed, founder of LogicGridLab" /></span><div><strong>Ejaz Ahmed</strong><small>Founder · Full-Stack Product Engineer</small></div><a className="founder-linkedin" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="Ejaz Ahmed on LinkedIn"><RiLinkedinFill /></a></div>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function LogoCloud() {
  return <section className="logo-cloud"><div className="container-site"><p>Powering modern sellers</p><div>{["Etsy", "Shopify", "Vercel", "Lovable Cloud", "OpenAI", "Stripe"].map((logo) => <span key={logo}><CircleDot />{logo}</span>)}</div></div></section>;
}

function About() {
  const stats = [["3+", "Years Building"], ["10+", "SaaS Products"], ["500+", "Active Users"], ["24/7", "WhatsApp Support"]];
  return (
    <section id="about" className="section-space">
      <div className="container-site">
        <Reveal><SectionHeading eyebrow="Inside LogicGridLab" title="Not Freelancers. A Dedicated Product Lab." copy="A focused product company combining senior engineering, commercial thinking, and direct founder access from Gujranwala to the world." /></Reveal>
        <div className="about-bento">
          <Reveal className="founder-card">
            <img src={sirEjazAsset} loading="lazy" width={912} height={1172} alt="Ejaz Ahmed, founder of LogicGridLab" />
            <div className="founder-overlay"><div><span>Founder</span><h3>Ejaz Ahmed</h3><p>Full-Stack Product Engineer<br/>Etsy Automation Specialist</p></div><blockquote>“Our mission: Give small sellers the same analytics power big brands have.”</blockquote></div>
          </Reveal>
          <Reveal className="office-card office-primary"><img src={ejazAsset} loading="lazy" width={912} height={1173} alt="Ejaz Ahmed working at the CEO desk in Gujranwala HQ"/><div><span>Founder at work</span><strong>CEO Desk — Gujranwala HQ</strong></div></Reveal>
          <Reveal className="office-card office-secondary"><img src={ceoAsset} loading="lazy" width={912} height={1173} alt="Ejaz Ahmed signing documents at the CEO desk"/><div><span>Founder at work</span><strong>CEO Desk — Gujranwala HQ</strong></div></Reveal>
          <div className="about-stats">{stats.map(([number,label]) => <Reveal key={label} className="stat-card"><strong>{number}</strong><span>{label}</span></Reveal>)}</div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section-space surface-band">
      <div className="container-site">
        <Reveal><SectionHeading eyebrow="Capabilities" title="Four systems. One product-minded team." copy="Each engagement is built around a measurable commercial outcome, not a list of disconnected deliverables." /></Reveal>
        <div className="service-bento">{services.map((service) => { const Icon = service.icon; return <Reveal key={service.title} className={`service-tile ${service.hot ? "service-hot" : ""}`}>
          <div className="service-top"><span className="service-icon"><Icon /></span><span className="service-index">{service.index}</span>{service.hot && <span className="hot-badge">Hot</span>}</div>
          <p className="tile-kicker">{service.kicker}</p><h3>{service.title}</h3><p>{service.copy}</p>
          <ul>{service.features.map((feature) => <li key={feature}><Check />{feature}</li>)}</ul>
          <div className="tile-footer"><strong>{service.price}</strong><div><a href={invoiceUrl(service.title)} target="_blank" rel="noreferrer">Pay with Stripe / Get Invoice</a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Chat about ${service.title}`}><MessageCircle /></a></div></div>
        </Reveal>})}</div>
      </div>
    </section>
  );
}

function AIAutomation() {
  return (
    <section id="ai-agents" className="section-space ai-section section-grid">
      <div className="container-site">
        <Reveal><div className="ai-heading"><SectionHeading eyebrow="AI Automation Lab" title="Add an AI Employee to Your Website" copy="Deploy always-on agents that answer, qualify, book, route, and follow up — while your team focuses on high-value work."/><Button variant="premium" size="premium" asChild><a href={whatsappDemoUrl} target="_blank" rel="noreferrer"><PhoneCall />Talk to Our AI Demo</a></Button></div></Reveal>
        <div className="ai-demo-grid">
          <Reveal className="ai-demo-card voice-card"><div className="demo-label"><AudioLines /><span>Voice Agent</span><i>Live</i></div><div className="call-orb"><PhoneCall /></div><div className="waveform">{Array.from({length: 24}).map((_,i)=><i key={i}/>)}</div><h3>Handles calls 24/7</h3><p>Answers FAQs, qualifies leads, and schedules appointments in a natural voice.</p></Reveal>
          <Reveal className="ai-demo-card chat-card"><div className="demo-label"><MessagesSquare /><span>AI Chatbot</span><i>Online</i></div><div className="chat-ui"><div><span>Visitor</span><p>Can you help me choose a plan?</p></div><div className="agent-message"><span>LogicGrid AI</span><p>Absolutely. I’ll ask two quick questions and recommend the best fit.</p></div><div className="typing"><i/><i/><i/></div></div><h3>Converts conversations</h3><p>Fast, on-brand answers trained around your products and qualification logic.</p></Reveal>
          <Reveal className="ai-demo-card workflow-card"><div className="demo-label"><Workflow /><span>Workflow Automation</span><i>Active</i></div><div className="workflow-ui"><span>Lead Form</span><ArrowRight/><span>AI Qualify</span><ArrowRight/><span>CRM</span></div><div className="tool-row"><span>n8n</span><span>Zapier</span><span>Make</span></div><h3>Moves work automatically</h3><p>Connect forms, calendars, CRM, email, and WhatsApp into one reliable flow.</p></Reveal>
        </div>
      </div>
    </section>
  );
}

function Products() {
  return <ProductStore />;
}

const galleryItems = [
  { src: ceoAsset, caption: "CEO Desk — Gujranwala HQ", className: "gallery-tall" },
  { src: headsMeetingAsset, caption: "Leadership & Product Meetings", className: "gallery-tall" },
  { src: leadsMeetingAsset, caption: "Leadership & Product Meetings", className: "gallery-wide" },
  { src: clientMeetingAsset, caption: "Global Client Collaboration", className: "gallery-tall" },
  { src: annualMeetingAsset, caption: "Team Culture — Annual Meeting", className: "gallery-tall" },
  { src: awardsAsset, caption: "Team Culture & Awards", className: "gallery-tall" },
  { src: groupPhotoAsset, caption: "The LogicGridLab Team", className: "gallery-wide" },
];

function RealGallery() {
  const [selected, setSelected] = useState<(typeof galleryItems)[number] | null>(null);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);
  return <section id="team" className="section-space real-gallery-section"><div className="container-site">
    <Reveal><div className="gallery-heading"><SectionHeading eyebrow="Inside LogicGridLab — Real Team, Real Office" title="Not Stock Photos. Our Actual Lab." copy="A closer look at founder-led product work, leadership meetings, global collaboration, and the team culture behind every launch."/><Button variant="premium" size="premium" asChild><a href="#contact">Meet the team in Gujranwala <ArrowRight/></a></Button></div></Reveal>
    <div className="masonry-gallery">{galleryItems.map((item, index) => <Reveal key={`${item.caption}-${index}`} className={`gallery-item ${item.className}`}><button type="button" onClick={() => setSelected(item)} aria-label={`Open ${item.caption}`}><img src={item.src} loading="lazy" alt={item.caption}/><span><small>{item.caption}</small><Maximize2/></span></button></Reveal>)}</div>
    <div className="culture-strip" aria-label="Team Culture and Awards"><figure><img src={annualMeetingAsset} loading="lazy" alt="LogicGridLab annual staff meeting"/><figcaption>Annual Meeting</figcaption></figure><figure><img src={awardsAsset} loading="lazy" alt="LogicGridLab team awards"/><figcaption>Team Awards</figcaption></figure><figure><img src={groupPhotoAsset} loading="lazy" alt="LogicGridLab group photo"/><figcaption>Our Team</figcaption></figure></div>
  </div>{selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.caption} onClick={() => setSelected(null)}><Button variant="glass" size="icon" onClick={() => setSelected(null)} aria-label="Close image"><X/></Button><figure onClick={(event) => event.stopPropagation()}><img src={selected.src} alt={selected.caption}/><figcaption>{selected.caption}</figcaption></figure></div>}</section>;
}

const directories = ["Product Hunt", "Futurepedia", "There’s An AI For That", "TopAI.tools", "AppSumo", "Uneed.co"];

function FeaturedDirectories() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { setStatus("error"); return; }
    setStatus("loading");
    const { error } = await supabase.from("directory_waitlist").insert({ email: parsed.data.toLowerCase(), source: "ai-directories" });
    if (error && error.code !== "23505") { setStatus("error"); return; }
    setStatus("success");
  };
  const focusEmail = () => document.getElementById("directory-email")?.focus();
  return <section className="section-space directory-section section-grid"><div className="container-site directory-inner"><Reveal><SectionHeading eyebrow="Featured on AI Platforms" title="Discover Us On Top AI Directories" copy="Follow LogicGridLab product launches across the world’s most active discovery communities." centered/></Reveal><div className="directory-grid">{directories.map((name, index) => <Reveal key={name} className="directory-card"><span className="directory-mark">{String(index + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>Launch Coming Q4</p></div><Button variant="glass" onClick={focusEmail}>Get Notified <ArrowRight/></Button></Reveal>)}</div><Reveal><form className="directory-form" onSubmit={submit} noValidate><div><Mail/><span><strong>Join the launch list</strong><small>Product announcements only. No spam.</small></span></div><label htmlFor="directory-email" className="sr-only">Email address</label><Input id="directory-email" name="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }} placeholder="you@company.com" maxLength={255} required aria-invalid={status === "error"}/><Button variant="premium" type="submit" disabled={status === "loading"}>{status === "loading" ? "Joining…" : "Notify Me"}<ArrowRight/></Button><p aria-live="polite">{status === "success" ? "You’re on the list. We’ll notify you before launch." : status === "error" ? "Enter a valid email address and try again." : ""}</p></form></Reveal></div></section>;
}

function Showcase() {
  return (
    <section id="showcase" className="section-space surface-band">
      <div className="container-site"><Reveal><SectionHeading eyebrow="Selected outcomes" title="Proof in the numbers." copy="Three examples of how focused product engineering turns operational friction into measurable momentum." /></Reveal>
        <div className="case-grid">{caseStudies.map((study, index) => { const Icon=study.icon; return <Reveal key={study.title} className={`case-card case-${index+1}`}><div className="case-icon"><Icon/></div><p className="tile-kicker">{study.tag}</p><h3>{study.title}</h3><p>{study.copy}</p><div className="metric-compare"><div><small>Before</small><strong>{study.before}</strong></div><ArrowRight/><div><small>After</small><strong>{study.after}</strong></div></div><span className="case-metric">{study.metric}</span></Reveal>})}</div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="section-space">
      <div className="container-site"><Reveal><SectionHeading eyebrow="Straightforward starting points" title="Invest in the system you need now." copy="Choose a focused package or start a conversation for a tailored product scope." centered /></Reveal>
        <div className="pricing-grid">{plans.map((plan) => <Reveal key={plan.name} className={`pricing-card ${plan.popular ? "pricing-popular" : ""}`}>{plan.popular && <span className="popular-label">Most popular</span>}<h3>{plan.name}</h3><p>{plan.copy}</p><div className="plan-price"><strong>{plan.price}</strong><span>{plan.suffix}</span></div><ul>{plan.features.map(feature=><li key={feature}><CheckCircle2/>{feature}</li>)}</ul><div className="plan-actions"><Button variant={plan.popular ? "premium" : "glass"} size="premium" className="w-full" asChild><a href={invoiceUrl(plan.name)} target="_blank" rel="noreferrer">Pay with Stripe / Get Invoice<ArrowRight/></a></Button><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle/>Chat on WhatsApp</a></div><p className="stripe-trust"><ShieldCheck/>Secure via Stripe · Official Invoice · 7-day Guarantee</p></Reveal>)}</div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section-space testimonial-section"><div className="container-site testimonial-layout"><Reveal><div><Eyebrow>Client signal</Eyebrow><h2>Trusted by people who build and sell.</h2><div className="google-rating"><Globe2/><div><strong>Google 5.0</strong><span className="stars">5.0</span></div></div></div></Reveal>
      <Reveal><Carousel opts={{loop:true}} className="testimonial-carousel"><CarouselContent>{testimonials.map((item)=><CarouselItem key={item.name}><article className="testimonial-card"><div className="stars">5.0</div><blockquote>“{item.quote}”</blockquote><div><span>{item.name.slice(0,1)}</span><p><strong>{item.name}</strong><small>{item.role}</small></p></div></article></CarouselItem>)}</CarouselContent><div className="carousel-buttons"><CarouselPrevious variant="glass"/><CarouselNext variant="glass"/></div></Carousel></Reveal>
    </div></section>
  );
}

function FAQ() {
  return <section className="section-space"><div className="container-narrow"><Reveal><SectionHeading eyebrow="Questions, answered" title="A clear process from brief to launch." centered /></Reveal><Reveal><Accordion type="single" collapsible className="faq-list">{faqs.map(([question,answer],index)=><AccordionItem key={question} value={`item-${index}`}><AccordionTrigger><span><small>0{index+1}</small>{question}</span></AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal></div></section>;
}

function Contact() {
  const [businessType, setBusinessType] = useState("");
  const [budget, setBudget] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const details = String(form.get("message") ?? "");
    const message = ["Hello LogicGridLab — I’d like to discuss a project.", "", `Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Business type: ${businessType}`, `Budget: ${budget}`, `Message: ${details}`].join("\n");
    window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    await supabase.from("inquiries").insert({
      name,
      email,
      phone: phone || null,
      service_interest: [businessType, budget].filter(Boolean).join(" · ") || null,
      message: details || null,
    });
  };
  return (
    <section id="contact" className="section-space final-cta section-grid"><div className="container-site contact-layout"><Reveal><div className="contact-copy"><Eyebrow>Gujranwala HQ · Global Delivery</Eyebrow><h2>Let’s Build Your Growth Engine</h2><p>Tell us where the friction is. You’ll speak directly with the product team and leave with a practical next step.</p><div className="contact-proof"><span><Check/>Direct founder access</span><span><Check/>7–14 day delivery window</span><span><Check/>Global WhatsApp support</span></div><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle/><span><small>WhatsApp</small><strong>+92-341-4249678</strong></span></a></div></Reveal>
      <Reveal><form onSubmit={submit} className="contact-form"><div className="field-grid"><label>Name<Input name="name" required placeholder="Your full name"/></label><label>Business type<Select value={businessType} onValueChange={setBusinessType} required><SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger><SelectContent>{["Etsy seller","Shopify brand","Startup","Local business","Agency"].map(item=><SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label></div><div className="field-grid"><label>Email<Input name="email" type="email" required placeholder="you@company.com"/></label><label>WhatsApp / phone<Input name="phone" placeholder="+92 341 4249678"/></label></div><label>Budget<Select value={budget} onValueChange={setBudget} required><SelectTrigger><SelectValue placeholder="Select budget"/></SelectTrigger><SelectContent>{["Under $500","$500–$1,500","$1,500–$5,000","$5,000+"].map(item=><SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label>Message<Textarea name="message" required placeholder="What would you like to build, automate, or improve?"/></label><Button variant="premium" size="premium" className="w-full"><MessageCircle/>Send via WhatsApp<ArrowRight/></Button><p><ShieldCheck/>Private enquiry. No sales spam.</p></form></Reveal>
    </div></section>
  );
}

function Footer() {
  return <footer><div className="container-site"><div className="footer-main"><div><Brand/><p>Premium software products, AI agents, and growth systems — built in Gujranwala, shipping worldwide.</p></div><div className="footer-columns"><nav><strong>Explore</strong><a href="#products">Products</a><a href="#services">Services</a><a href="#pricing">Pricing</a></nav><nav><strong>Company</strong><a href="#about">About Lab</a><a href="#team">Our Team</a><a href="#contact">Contact</a><a href="mailto:logicgridlab@gmail.com">Email</a></nav><nav><strong>Legal</strong><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={etsyShopUrl} target="_blank" rel="noreferrer">Etsy Shop</a></nav></div></div><div className="footer-bottom"><span>Gujranwala, Punjab, Pakistan</span><a href="mailto:logicgridlab@gmail.com">logicgridlab@gmail.com</a><span>© 2026 LogicGridLab</span></div></div></footer>;
}

export function HomePage() {
  return <div className="site-shell"><Header/><main><Hero/><LogoCloud/><About/><RealGallery/><Services/><AIAutomation/><Products/><FeaturedDirectories/><Showcase/><Pricing/><Testimonials/><FAQ/><Contact/></main><Footer/><a href={whatsappUrl} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Chat with LogicGridLab on WhatsApp"><MessageCircle/></a></div>;
}

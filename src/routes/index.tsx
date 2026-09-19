import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import teamImage from "@/assets/logicgridlab-team.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const whatsappUrl = "https://wa.me/923414249678";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LogicGridLab — Premium WebApps, SaaS & SEO Agency for Etsy Sellers" },
      {
        name: "description",
        content:
          "LogicGridLab builds premium SaaS products, high-converting websites, SEO growth engines, and reliable care plans for Etsy sellers, Shopify brands, and startups worldwide.",
      },
      {
        property: "og:title",
        content: "LogicGridLab — Premium WebApps, SaaS & SEO Agency for Etsy Sellers",
      },
      {
        property: "og:description",
        content:
          "Engineering digital growth engines for Etsy sellers, Shopify brands, and ambitious startups worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const navItems = [
  ["Products", "showcase"],
  ["Solutions", "services"],
  ["Showcase", "showcase"],
  ["About", "about"],
  ["Reviews", "reviews"],
  ["Contact", "contact"],
];

const services = [
  {
    icon: Code2,
    title: "Custom WebApp & SaaS Development",
    text: "From MVP to scale — multi-tenant SaaS, dashboards, Etsy and Shopify integrations, and admin panels. Built in 7–14 days.",
    price: "Starting $299",
    label: "Product engineering",
  },
  {
    icon: Search,
    title: "Website Revamp + SEO Domination",
    text: "We turn slow WordPress sites into lightning-fast, SEO-ready conversion machines with schema, lead capture, and 95+ speed.",
    price: "Starting $199",
    label: "Growth systems",
  },
  {
    icon: ShieldCheck,
    title: "Website Maintenance & Care Plans",
    text: "Updates, backups, uptime monitoring, bug fixes, speed checks, and priority support. No lock-in, just dependable care.",
    price: "From $29/mo or $249/year",
    label: "Always-on support",
  },
];

const products = [
  {
    status: "Live · Bestseller",
    live: true,
    name: "EtsyOps",
    subtitle: "Multi-Shop Analytics",
    description:
      "The #1 dashboard for Etsy sellers — track orders, revenue, fees, profit, listing performance, and ad spend across unlimited shops. Demo mode included.",
    price: "$39 Lifetime on Etsy",
    metric: "120+ sellers",
    url: "https://etsyops.logicgridlab.com",
  },
  {
    status: "Coming Q4 2025",
    name: "ShopSync",
    subtitle: "Etsy + Shopify Sync",
    description:
      "Never oversell — automatically sync inventory and orders between Etsy and Shopify in real time.",
    metric: "Waitlist open",
    url: "https://shopsync.logicgridlab.com",
    waitlist: true,
  },
  {
    status: "Building",
    name: "ListRank",
    subtitle: "Etsy SEO Optimizer",
    description:
      "AI tag and title optimization that uncovers high-traffic, low-competition keywords built for stronger ranking.",
    metric: "Early access soon",
    url: "https://listrank.logicgridlab.com",
  },
  {
    status: "In the lab",
    name: "ReviewBoost",
    subtitle: "Review Automation",
    description:
      "Turn every order into a five-star opportunity with thoughtful, automated, Etsy-compliant follow-ups.",
    metric: "Roadmap 2026",
    url: "https://reviewboost.logicgridlab.com",
  },
];

const testimonials = [
  {
    quote: "EtsyOps saved me 10 hours a week. Finally I see real profit after Etsy fees!",
    name: "Sarah M.",
    shop: "Handmade Jewelry Shop · USA",
  },
  {
    quote: "LogicGridLab delivered my website in 5 days. SEO score went from 42 to 98.",
    name: "Ahmed K.",
    shop: "Shopify Store Owner · UK",
  },
  {
    quote: "Professional team, WhatsApp support is instant. Feels like a real company.",
    name: "Fatima S.",
    shop: "Digital Products · UAE",
  },
  {
    quote: "We launched faster than planned, and the product has been rock solid from day one.",
    name: "Daniel R.",
    shop: "E-commerce Founder · Canada",
  },
];

function Brand() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="LogicGridLab home">
      <img src="/favicon.png" alt="LogicGrid trademark" width={36} height={36} className="size-9" />
      <span className="font-display text-[17px] font-semibold text-foreground">
        LogicGrid<span className="text-primary-soft">Lab</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container-wide flex h-[72px] items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map(([label, id]) => (
            <a key={label} href={`#${id}`} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-compact">
            <MessageCircle className="size-4 text-success" />
            +92-3414249678
          </a>
          <Button variant="premium" size="default" asChild>
            <a href="#contact">Start Your Project <ArrowRight /></a>
          </Button>
        </div>
        <Button
          variant="glass"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="mobile-nav md:hidden" aria-label="Mobile navigation">
          {navItems.map(([label, id]) => (
            <a key={label} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}<ArrowRight className="size-4" />
            </a>
          ))}
          <Button variant="premium" size="premium" asChild>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </Button>
        </nav>
      )}
    </header>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-copy">{text}</p>}
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-grid relative overflow-hidden border-b border-border">
      <div className="hero-radiance" />
      <div className="container-narrow relative flex min-h-[860px] flex-col items-center justify-center pb-28 pt-32 text-center sm:min-h-[900px]">
        <div className="trust-badge"><Rocket className="size-4" />Trusted by 500+ Etsy Sellers & SMEs Worldwide</div>
        <h1 className="mt-8 max-w-5xl font-display text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-[76px]">
          We Build WebApps, SaaS & <span className="text-gradient">SEO Engines</span> That Scale Your Business
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          LogicGridLab is a Gujranwala-based premium software lab crafting high-performance SaaS tools,
          converting websites, and 24/7 maintenance systems for Etsy sellers, Shopify brands, and startups worldwide.
        </p>
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button variant="premium" size="premium" asChild>
            <a href="#showcase">Explore Our Lab <ArrowRight /></a>
          </Button>
          <Button variant="glass" size="premium" asChild>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle />Book Free Strategy Call</a>
          </Button>
        </div>
        <div className="trust-strip">
          {["Etsy", "Shopify", "Vercel", "Supabase"].map((name) => <span key={name}>{name}</span>)}
          <i />
          <span><Check />10+ Apps Shipped</span>
          <span><Zap />99.9% Uptime</span>
          <span><Sparkles />Lifetime Updates</span>
        </div>
        <a href="#about" className="scroll-cue" aria-label="Scroll to about section"><span /></a>
      </div>
    </section>
  );
}

function About() {
  const stats = [
    ["3+", "Years Building"], ["10+", "SaaS Products"], ["500+", "Active Users"], ["24/7", "WhatsApp Support"],
  ];
  return (
    <section id="about" className="section-shell">
      <div className="container-wide grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
        <div className="lab-visual">
          <img src={teamImage} alt="LogicGridLab product engineering team collaborating in the software lab" loading="lazy" width={1600} height={1200} />
          <div className="lab-visual-caption"><span className="pulse-dot" />Gujranwala HQ · Global delivery</div>
          <div className="lab-seal"><Code2 /><strong>Product<br />Lab</strong></div>
        </div>
        <div>
          <SectionHeading eyebrow="Inside LogicGrid" title="Not Freelancers. A Dedicated Product Lab." />
          <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground">
            <p><strong className="text-foreground">LogicGridLab (LogicGrid)</strong> is a registered software product company headquartered in Gujranwala, Pakistan — serving clients globally.</p>
            <p>We are not a marketplace gig. We are a product lab with a dedicated stack: Lovable, Supabase, Vercel, and Next.js. We ship SaaS in days, not months.</p>
          </div>
          <div className="founder-line">
            <div className="founder-mark">EA</div>
            <div><strong>Ejaz Ahmed</strong><span>Founder · Full-Stack Product Engineer<br />Etsy Automation Specialist</span></div>
          </div>
          <div className="mission-line"><TrendingUp /><p><span>Our mission</span>Give small sellers the same analytics power big brands have.</p></div>
          <div className="stats-grid">
            {stats.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section-shell section-tinted">
      <div className="container-wide">
        <SectionHeading eyebrow="What we engineer" title="Three Ways We Drive Digital Growth" text="Focused services, senior execution, and a clear path from idea to dependable growth." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="service-card">
                <div className="card-index">0{index + 1}</div>
                <div className="service-icon"><Icon /></div>
                <p className="card-label">{service.label}</p>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="card-footer"><strong>{service.price}</strong><a href="#contact" aria-label={`Discuss ${service.title}`}><ArrowRight /></a></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const joinWaitlist = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  };
  return (
    <section id="showcase" className="section-shell overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Products from our lab" title="Live Products & Upcoming Roadmap" text="Every product lives on its own LogicGridLab subdomain. Open any card to explore the app." />
          <div className="lab-status"><span className="pulse-dot" />Lab systems operational</div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <article key={product.name} className={`product-card ${index === 0 ? "md:col-span-2 lg:col-span-2 product-featured" : ""}`}>
              <a href={product.url} target="_blank" rel="noreferrer" className="product-link" aria-label={`Open ${product.name}`} />
              <div className="relative z-[1] flex h-full flex-col pointer-events-none">
                <div className="flex items-start justify-between gap-5">
                  <span className={product.live ? "status-live" : "status-upcoming"}><span />{product.status}</span>
                  {product.live ? <img src="/favicon.png" alt="" width={42} height={42} className="size-10" /> : <span className="product-number">0{index + 1}</span>}
                </div>
                <div className="mt-10">
                  <p className="product-kicker">{product.subtitle}</p>
                  <h3>{product.name}</h3>
                  <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{product.description}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-10">
                  <div>{product.price && <strong className="block text-sm text-primary-soft">{product.price}</strong>}<span className="mt-1 block text-xs text-muted-foreground">{product.metric}</span></div>
                  {product.waitlist ? (
                    <Button variant="glass" className="pointer-events-auto" onClick={(event) => { event.preventDefault(); setWaitlistOpen(true); }}>Join Waitlist <ArrowRight /></Button>
                  ) : <span className="open-app">Click to open app <ExternalLink /></span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Dialog open={waitlistOpen} onOpenChange={(open) => { setWaitlistOpen(open); if (!open) setJoined(false); }}>
        <DialogContent className="waitlist-dialog">
          <DialogHeader>
            <DialogTitle>{joined ? "You’re on the early-access list." : "Join the ShopSync waitlist"}</DialogTitle>
            <DialogDescription>{joined ? "We’ll reach out when ShopSync is ready for early users." : "Get launch updates and an invitation to test Etsy + Shopify inventory sync."}</DialogDescription>
          </DialogHeader>
          {joined ? <div className="success-message"><Check /> Thanks — watch your inbox.</div> : (
            <form onSubmit={joinWaitlist} className="mt-3 space-y-3">
              <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@business.com" className="h-12" />
              <Button variant="premium" size="premium" className="w-full">Reserve early access <ArrowRight /></Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Reviews() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((value) => (value + 1) % testimonials.length);
  const previous = () => setCurrent((value) => (value - 1 + testimonials.length) % testimonials.length);
  const testimonial = testimonials[current] ?? testimonials[0];
  if (!testimonial) return null;
  return (
    <section id="reviews" className="section-shell section-tinted">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Proof over promises" title="Trusted by Sellers Who Scale" text="Independent founders and growing commerce teams rely on LogicGridLab to turn operational friction into momentum." />
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="review-badge"><Globe2 /><span><strong>Google</strong><small>5.0 customer rating</small></span></div>
              <div className="review-badge"><Star /><span><strong>Etsy</strong><small>Seller-approved tools</small></span></div>
            </div>
          </div>
          <div className="testimonial-shell" aria-live="polite">
            <div className="quote-mark">“</div>
            <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} />)}</div>
            <blockquote>{testimonial.quote}</blockquote>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div className="reviewer"><div>{testimonial.name.slice(0, 1)}</div><span><strong>{testimonial.name}</strong><small>{testimonial.shop}</small></span></div>
              <div className="carousel-controls">
                <Button variant="glass" size="icon" onClick={previous} aria-label="Previous testimonial"><ChevronLeft /></Button>
                <span>{String(current + 1).padStart(2, "0")} / 04</span>
                <Button variant="glass" size="icon" onClick={next} aria-label="Next testimonial"><ChevronRight /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [service, setService] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hello LogicGridLab!%0A%0AName: ${encodeURIComponent(String(form.get("name") ?? ""))}%0ABusiness: ${encodeURIComponent(String(form.get("business") ?? ""))}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(String(form.get("message") ?? ""))}`;
    window.open(`${whatsappUrl}?text=${message}`, "_blank", "noopener,noreferrer");
  };
  return (
    <section id="contact" className="section-shell contact-section">
      <div className="container-wide">
        <SectionHeading eyebrow="Start a conversation" title="Let’s Build Your Growth Engine" text="Tell us what you are building. You will speak directly with the product team — no sales maze." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div className="contact-card">
            <div className="flex items-center gap-3"><img src="/favicon.png" alt="" width={48} height={48} className="size-12" /><div><strong>LogicGridLab (LogicGrid)</strong><span>A Premium Software Lab</span></div></div>
            <div className="contact-list">
              <div><Users /><span><small>Founder</small><strong>Ejaz Ahmed</strong></span></div>
              <div><MapPin /><span><small>Head office</small><strong>Mumtaz Market, opposite ChaseUp<br />Main GT Road, Gujranwala</strong></span></div>
              <div><Mail /><span><small>Email</small><a href="mailto:info@logicgridlab.com">info@logicgridlab.com</a></span></div>
              <div><Globe2 /><span><small>Hours</small><strong>Mon–Sat, 12AM–12PM PKT<br />Global support</strong></span></div>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-card"><MessageCircle /><span><strong>Chat Now — Instant Reply</strong><small>+92-3414249678</small></span><ArrowRight /></a>
          </div>
          <form onSubmit={submit} className="contact-form">
            <div className="grid gap-5 sm:grid-cols-2">
              <label>Name<Input name="name" required placeholder="Your full name" /></label>
              <label>Business<Input name="business" required placeholder="Company or shop name" /></label>
            </div>
            <label>Service
              <Select value={service} onValueChange={setService} required>
                <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                <SelectContent>
                  {["WebApp", "Website", "SEO", "Maintenance"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </label>
            <label>Message<Textarea name="message" required placeholder="What would you like us to build or improve?" /></label>
            <Button variant="premium" size="premium" className="w-full sm:w-auto"><MessageCircle />Send via WhatsApp</Button>
            <p className="form-note"><ShieldCheck />Your details stay private and are only used to discuss your project.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-deep">
      <div className="container-wide py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><Brand /><p className="max-w-md text-sm leading-6 text-muted-foreground">Engineering digital growth engines for ambitious sellers, brands, and startups worldwide.</p></div>
        <div className="footer-rule" />
        <div className="flex flex-col gap-5 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p>© 2025 LogicGridLab (Pvt) Ltd · All SaaS apps hosted on logicgridlab.com subdomains</p>
          <div className="flex flex-wrap gap-5"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://etsy.com/shop/logicgridlab" target="_blank" rel="noreferrer">Etsy Shop</a></div>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Built with <span className="text-primary-soft">♥</span> in Gujranwala, Pakistan — Shipping Worldwide</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return <div className="min-h-screen bg-background text-foreground"><Header /><main><Hero /><About /><Services /><Showcase /><Reviews /><Contact /></main><Footer /></div>;
}
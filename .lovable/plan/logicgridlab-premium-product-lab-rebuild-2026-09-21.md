# LogicGridLab premium product-lab rebuild

## Direction
- Rebuild the homepage as an official dark product-lab site inspired by Linear, Vercel, Stripe, and Framer.
- Use near-black surfaces, precise blue-to-violet accents, Geist/Inter typography, restrained glass effects, subtle grid texture, large whitespace, bento layouts, and motion that respects reduced-motion preferences.
- Keep the existing TanStack Start foundation rather than replacing the project framework; preserve the current logo, favicon, contact details, legal pages, and working WhatsApp flow.

## Homepage structure
1. Sticky navigation with Products, Services, AI Agents, Showcase, Pricing, About Lab, Products-linked Login, and Start Project.
2. Two-column hero with the supplied copy, trust proof, dashboard mockup, analytics charts, and floating reliability cards.
3. Technology logo cloud for Etsy, Shopify, Vercel, Supabase, OpenAI, and LemonSqueezy.
4. About Lab bento with generated, replaceable founder and office/team imagery, founder quote, and four operational stats.
5. Four service cards, including the highlighted AI Automation Lab, feature checklists, and starting prices.
6. Dedicated AI Automation section with voice waveform, chatbot, workflow demos, and a WhatsApp-based voice-demo request.
7. Product store with four product cards, placeholder LemonSqueezy checkout URLs, checkout script support, trust messaging, and a new thank-you page.
8. Results showcase with three large case studies and clear before/after metrics.
9. Three service pricing plans with placeholder LemonSqueezy checkout actions and Growth highlighted.
10. Touch-friendly testimonial carousel with the approved reviews and Google 5.0 proof.
11. Six-question FAQ.
12. Final contact section with Name, Business Type, Budget, Message, and prefilled WhatsApp submission.
13. Minimal premium footer with brand and legal links.

## Assets and interactions
- Generate a cohesive professional founder portrait and two collaborative office images. Keep them as isolated project assets so they can be replaced later without redesigning the section.
- Add polished scroll reveals and micro-interactions without a heavy animation dependency unless the current package set already includes one.
- Keep all buttons and controls functional; external checkout buttons will intentionally use clearly centralized placeholder product IDs until real LemonSqueezy URLs are supplied.
- Add `lemonsqueezy.config.js` as the single source for placeholder product IDs and checkout URLs.

## Technical and quality work
- Split the oversized homepage into focused data and section components before composing the final page.
- Add the requested LemonSqueezy script in the document head and create `/thank-you` with unique metadata.
- Update homepage metadata to “LogicGridLab — Premium SaaS Lab | WebApps, AI Agents & Website Growth” with app-specific descriptions and canonical URLs.
- Preserve metadata on Privacy and Terms, and verify the new Thank You route is intentionally excluded from search.
- Verify desktop and mobile layouts, navigation, checkout links, carousel, FAQ, WhatsApp messages, image loading, console health, and the final build signal.

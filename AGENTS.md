<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Load checkout scripts in the TanStack root document head, not a separate index.html, because this app uses the Start document shell.
- Store per-product card checkout URLs in products.lemon_squeezy_url and map to lemonSqueezyUrl for the storefront; validate before opening, and keep the hosted link as fallback when the overlay is unavailable.

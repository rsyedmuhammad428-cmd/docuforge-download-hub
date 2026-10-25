# DocuForge Website

Marketing site + private admin analytics for **DocuForge — Powered by RazaZaidi.AI**, a
Windows desktop application for PDF and document utilities.

Built with TanStack Start (React 19 + TypeScript), Tailwind CSS v4, Motion for React,
Recharts, and Lovable Cloud (managed database + auth).

## Public site

- `/` — Hero, Features, How It Works, Product Showcase, Download, About strip
- `/privacy` — offline-first privacy policy
- `/about` — about DocuForge and RazaZaidi.AI

### Download integration

Download buttons (navbar, hero, download section, footer) resolve the **latest Windows
download live from the GitHub Releases API** of
`rsyedmuhammad428-cmd/DocuForge.exe` — version, exact asset name, file size, and the
verified GitHub download count are never hardcoded. If no release exists (or GitHub is
unreachable), buttons fall back to the [Releases page](https://github.com/rsyedmuhammad428-cmd/DocuForge.exe/releases).

Honesty rules enforced in `src/lib/installer.ts` + `src/test/installer.test.ts`:

- The linked asset is always the real published file.
- A ZIP archive is labeled "(ZIP archive)" — never presented as an EXE installer.

Each button press records one **anonymous** click (button placement, version, page —
no IP, no identifiers) into the `download_clicks` table.

## Admin dashboard

- `/admin` — private analytics (redirects to `/auth` when signed out)
- `/auth` — email/password sign-in & account creation (noindex)

Dashboard features: total / range / today click counts, verified GitHub release
downloads, daily & monthly charts (Recharts), version-wise stats, date filters,
recent activity, CSV export, and loading / empty / error / no-access states.

### Giving an account admin access

1. Sign up via `/auth` (or add the user under **More → Users** in the Lovable editor).
2. Grant the admin role in the database (requires agent/editor access):

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = '<owner-email>';
   ```

   (Only after this row exists can the account read analytics; the check runs
   server-side via the `public.has_role` security-definer function.)

## Database

Provisioned automatically by Lovable Cloud. Schema (see `drizzle/migrations/`):

- `user_roles` — admin role assignments (never store roles on profiles)
- `download_clicks` — anonymous button-click events
  - INSERT: public (validated by policy — source must be one of `navbar`, `hero`,
    `download`, `footer`)
  - SELECT: admins only, via `has_role(auth.uid(), 'admin')`

## Environment

`.env.example` documents placeholders only. On Lovable these variables are provisioned
automatically; never put secrets in `VITE_*` variables.

## Deployment

Deploy/publish through Lovable (no manual Vercel setup needed — the project runs on
Lovable's managed hosting with the connected Cloud backend). To self-host instead:
`npm i && npm run build`, serve the output, and provide the environment variables from
`.env.example` with real values.

## Development

```sh
npm i
npm run dev      # local dev server
npm run test     # vitest unit tests
```

## Built with

- TanStack Start · React 19 · TypeScript
- Tailwind CSS v4 ("Digital Paper Atelier" design system in `src/styles.css`)
- Motion for React (scroll reveals, reduced-motion aware)
- Recharts (admin analytics)
- Lovable Cloud (database, auth)

# Roadmap

## In progress: DocuForge website build
- [x] Lovable Cloud enabled; email auth enabled
- [x] Migration: user_roles + has_role + download_clicks (RLS, grants)
- [x] Design system (Digital Paper Atelier) + generated app preview images
- [x] Release resolution from GitHub API (installer picker, fallback to Releases page)
- [x] Marketing pages: home (hero/features/how-it-works/showcase/download/about strip), /about, /privacy, navbar+footer
- [x] /auth sign-in/sign-up; _authenticated gate
- [x] Admin dashboard /admin (charts, filters, CSV, states)
- [x] Typecheck clean; 8/8 tests pass; all pages HTTP 200
- [x] E2E: anonymous download click on home records (source=navbar, version=0.5.1, page_path=/); button href = exact v0.5.1 ZIP URL
- [ ] Promote site owner to admin role — BLOCKED: no auth user exists yet; user must sign up on /auth with their own email (Lovable Cloud signup allow-list rejects arbitrary emails, e.g. test@example.com)
- [ ] Verify admin dashboard signed-in E2E (charts, CSV) — depends on the previous task

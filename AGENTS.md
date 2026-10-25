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

## Project rules

- Download facts (version, asset URL, file size, download counts) must always come
  live from the GitHub Releases API (`src/lib/release-info.ts`) — never hardcode a
  release version or asset URL in the UI. The release lives on
  `rsyedmuhammad428-cmd/DocuForge.exe`.
- Never label a ZIP asset as an EXE installer. The real asset name is shown with a
  "(ZIP archive)" suffix when the asset is a ZIP (see `src/lib/installer.ts`, covered
  by `src/test/installer.test.ts`).
- Download-click analytics are anonymous by design: `download_clicks` stores only
  source, version, and page path. Never add IP addresses, user agents, or other PII.
- Admin access is granted only via rows in `public.user_roles` checked server-side
  with `public.has_role`; never derive admin status from profiles or client state.
- Marketing pages share the `_marketing` pathless layout (navbar + footer). `/auth`
  and `/_authenticated/*` intentionally stay outside it.
- App images (hero/showcase previews) are illustrative generated previews in
  `src/assets/` — replace them with genuine screenshots if the owner supplies real
  ones, and keep the "illustrative preview" captions honest when they are not real.

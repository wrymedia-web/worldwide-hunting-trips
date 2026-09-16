# WWHT Marketplace — Changelog
*Created: 2026-05-21*

## 2026-05-21
- Project memory files scaffolded (BRIEF, CONTEXT, TASKS, DECISIONS, CHANGELOG, HANDOFF).
- Flagged: critical project context missing (see PROJECT_CONTEXT.md).

## 2026-09-16 — Terrance punch-list round 2 (commit cd56f8d)
- Hunter/outfitter dashboard toggle (both headers); outfitter favorites now reachable.
- Inquiry replies now visible in hunter dashboard (select + UI; data was already saved).
- Forgot-password flow built: /forgot-password, /auth/callback (PKCE + OTP), /reset-password.
  ⚠️ Requires Supabase Auth config: add https://worldwidehuntingtrips.com/auth/callback to Redirect URLs.
- Outfitter logo upload/replace/remove → outfitter-logos bucket (created, public); shows on public profile + dashboard.
- Profile save now shows explicit "Changes saved" confirmation.
- Analytics wired: supabase/migrations/010_page_views.sql (⚠️ NOT YET APPLIED — needs SQL editor/PAT),
  server-side view tracking on /hunt/[id] and /outfitter/[id], live dashboard stats.
  Code degrades to "—" until the migration is applied.
- Homepage hero: "across the United States" → "across the world".

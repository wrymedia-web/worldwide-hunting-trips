# WWHT Marketplace — Project Context
*Updated: 2026-05-28 by MOD-MAIN (verified against code + live site)*

## What it is
"Airbnb for hunting outfitters" — a marketplace/directory at **worldwidehuntingtrips.com**
where hunters discover, compare, and contact/book outfitters and guided hunts.

## Workspace
`/Users/modernoutdoormedia/.openclaw/workspace/wwht-platform/`

## Stack (verified)
- **Framework:** Next.js (App Router, TypeScript)
- **Backend:** Supabase — auth + Postgres. Project: `gjnbsvirernljoxtedii.supabase.co`
  - Clients in `lib/supabase/{client,server,admin}.ts`
- **UI:** shadcn + Tailwind + Base UI (`@base-ui/react`), lucide icons
- **Owner:** MOD-DEV

## Deployment (verified)
- **Vercel project:** `wwht-platform` (id `prj_jAKvTJ1cnO48dmjOtA2HAWGqnDyZ`, team Modern Outdoor Media `team_9RO5SuAyUYtsom3KE739dIF2`)
- **Live:** https://worldwidehuntingtrips.com — returns 200, serving the Next.js app (title "Worldwide Hunting Trips")

## Features built (routes under app/)
- `/` homepage, `/about`, `/browse`
- `/outfitters` + `/outfitter/[id]` — outfitter listings & profile pages
- `/hunt/[id]` — hunt detail pages
- `/species` + `/species/[species]` — browse hunts by species (21 species)
- `/states` + `/states/[state]` — browse by location
- `/hunt-customizer` — build/customize a hunt request
- `(auth)/login` + `(auth)/signup` — real Supabase auth (working)
- `/dashboard/hunter` — hunter dashboard
- `/dashboard/outfitter` (+ `/setup`, `/listings/new`, `/listings/[id]/edit`) — outfitter dashboard & listing management

## Current status
- Site is **live** with **mock/example data** — last commit (`b8ad79b`) added "Example" badges to all mock hunt & outfitter cards. Real outfitter listings not yet populated.
- Auth is functional (real Supabase signup/login, RLS configured).
- Last active development ~2026-05-20/21 by MOD-DEV.

## Terminology mapping (from original theme concept)
Outfitters/Guides (not "freelancers"); Hunts/Guided Hunts/Packages (not "services");
Hunting Trips/Experiences (not "projects"); Hunters/Outdoorsmen (not "clients").

## Hunt categories (21 species)
Whitetail, Mule Deer, Elk, Moose, Black Bear, Brown/Grizzly Bear, Mountain Lion, Bison,
Antelope/Pronghorn, Dall Sheep, Rocky Mtn Bighorn, Desert Bighorn, Stone Sheep, Mountain
Goat, Caribou, Wild Boar/Hog, Turkey, Predator/Coyote, Wolf, Waterfowl, Upland Bird.

## Known gaps / next steps
- Populate real outfitter listings (replace mock/example data).
- Confirm domain → Vercel production wiring is the intended final state.
- SiteGround `wwht` SSH was broken (DNS for ssh.worldwidehuntingtrips.com missing) — not needed if hosting is fully on Vercel.
- No payment/booking transaction layer documented yet (currently inquiry/contact-oriented).

## Design direction
Rugged but modern outdoor feel; dark earthy tones (greens/browns/blacks); large
photography-focused layouts; adventure/trophy/destination emphasis.

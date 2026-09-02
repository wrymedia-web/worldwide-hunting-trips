# Scope: Worldwide Destination Expansion

**Goal:** Take the platform from US-state-only to a true worldwide hunting marketplace.
**Status:** Scoping (not yet built). Authored 2026-05-28 from Wes's destination brief.

---

## 1. Where we are today

- Geography is **US-only**. `STATES` is hardcoded (50 in `components/search-bar.tsx`, 15 in `app/browse/page.tsx`).
- Location landing pages live at `/states/[state]`.
- Copy assumes US: browse header "across the United States", footer "largest hunting outfitter marketplace in America", homepage "Reach thousands of hunters nationwide".
- Species list is US-centric (`Whitetail Deer`, `Elk`, …) with a few exotics (`Red Stag`, `Axis Deer`, `Aoudad Sheep`).
- **Foundation already exists:** hunt records carry a `country` field (see `mockHunt.country` in `app/hunt/[id]/page.tsx`), so the data model was anticipated.

---

## 2. Target taxonomy (from Wes)

Hierarchy: **Region group → Country → (sub-region) → signature species/hunt types.**

### North America (outside U.S.)
- **Canada** — moose, black bear, brown/grizzly bear, waterfowl, caribou. Provinces: Alberta, Saskatchewan, British Columbia, Yukon.
- **Mexico** — desert mule deer, Coues deer, Gould's turkey, dove & waterfowl.

### Africa
- **South Africa** — #1 entry point. Plains game: kudu, impala, wildebeest, gemsbok, zebra. Large infrastructure, affordable.
- **Namibia** — free-range safaris: gemsbok, springbok, kudu, eland.
- **Zimbabwe** — dangerous game: Cape buffalo, leopard, elephant.
- **Tanzania** — high-end luxury safari, dangerous game, large concessions.
- **Mozambique** — buffalo & dangerous game; growing.

### Europe
- **Spain** — ibex, red stag, driven bird shoots. Top European destination for Americans.
- **Scotland** — Highlands red stag, estate-style tradition.

### Oceania
- **New Zealand** — red stag, tahr, chamois, fallow deer. Scenery/adventure draw.

### Central & South America
- **Argentina** — world's top wingshooting (high-volume dove), Patagonia red stag, duck.
- **Uruguay** — dove & duck, relaxed travel.
- **Chile** — red stag, waterfowl, Patagonia adventure.

### Asia / Mountain
- **Mongolia** — ibex, argali sheep, rugged expeditions.
- **Kyrgyzstan** — Mid-Asian ibex, Marco Polo sheep.
- **Pakistan** — markhor, prestige once-in-a-lifetime.

### Seed priority (most popular for Americans now)
1. South Africa  2. Argentina  3. New Zealand  4. Canada  5. Spain

### Demand-based collections (curated landing pages / category filters)
African safaris · Argentina dove · New Zealand red stag · Canadian moose/bear · Spain ibex · Mountain hunts (ibex/sheep) · Dangerous game · Waterfowl lodges · Turkey hunts · Free-range plains game.

### Bucket-list hunts (marketing hooks)
Cape buffalo · NZ red stag roar · Argentina dove · Marco Polo sheep · Markhor · Yukon moose · Scottish red stag rut.

---

## 3. Data model changes

- **`countries`** — `id, name, slug, region_group, sort_order`. Seed the list above.
- **`regions`** — `id, country_id, name, slug`. Provinces/areas (Alberta, Patagonia, Highlands, Yukon, Limpopo…). Optional per listing.
- **`hunt_listings`** — add `country_id` (FK) + keep/repurpose `state` as free-text `region`/`area`. Existing US rows map to country = United States.
- **`species`** — expand massively and add a **`category`** column:
  - *North American Big Game* — whitetail, mule deer, elk, moose, caribou, black bear, brown/grizzly, pronghorn, bison, cougar, sheep (bighorn/Dall), mountain goat, wolf.
  - *African Plains Game* — kudu, impala, wildebeest, gemsbok, zebra, eland, springbok, nyala, bushbuck, warthog, …
  - *African Dangerous Game* — Cape buffalo, leopard, lion, elephant, hippo, crocodile.
  - *Mountain & Sheep* — Spanish ibex, Mid-Asian ibex, argali, Marco Polo sheep, markhor, tahr, chamois, aoudad.
  - *European / Oceania Deer* — red stag, fallow, roe, sika, axis.
  - *Wingshooting & Waterfowl* — dove, ducks, geese, pigeon.
  - *Turkey* — incl. Gould's. *Exotics* — catch-all.
- **`hunt_collections`** (optional) — curated demand groupings → landing pages.

---

## 4. UI / UX changes

- **Search bar** (`components/search-bar.tsx`): replace single "State" dropdown with **Destination (country)** + optional **Region**; group the expanded species list by category. Carry params to `/browse`.
- **Browse** (`app/browse/page.tsx`): country + region filters; species grouped by category; add a **Hunt Type / Collection** filter (plains game, dangerous game, wingshooting, mountain…). Dynamic count already wired.
- **Navigation / footer**: "Browse by State" → "Browse by Destination" (region group → country). Update footer tagline.
- **Landing pages**: `/destinations` (index by region group) → `/destinations/[country]` → `/destinations/[country]/[region]`. Collection pages at `/hunts/[collection]` (e.g. `/hunts/african-safari`).
- **Homepage**: feature international destinations + bucket-list collections.

---

## 5. Routing & SEO

- **Decision needed:** keep `/states/[state]` for US (SEO equity) and add `/destinations/*` for the rest, **or** unify everything under `/destinations` with 301s from old `/states/*`. Recommended: unify, 301 the US state URLs into `/destinations/united-states/[state]`.
- Per-country and per-collection meta titles/descriptions; structured data for destinations.
- Copy sweep: "across the United States", "nationwide", footer "in America" → worldwide framing.

---

## 6. Phasing

- **Phase 1 — Data + taxonomy.** Add countries/regions/species-category tables; expand species; add `country_id` to listings; seed top 5 countries (SA, Argentina, NZ, Canada, Spain). Copy sweep. *No major UI yet.*
- **Phase 2 — Discovery.** Destination location picker in search + browse; destination landing pages; navigation.
- **Phase 3 — Merchandising.** Demand-based collection pages, homepage features, SEO, bucket-list hooks.

---

## 7. Decisions (confirmed by Wes 2026-05-28)

1. **US state pages** — **Keep `/states/*` as-is, add `/destinations/*` alongside for international.** No restructure/redirects (avoids risk + preserves US SEO).
2. **Region depth** — **country → region**, region optional per listing (populate where it matters: Canada provinces, Patagonia, SA provinces).
3. **Pricing** — **keep it simple for v1**: current flat per-person model. No trophy-fee/daily-rate fields yet.
4. **Dangerous game** — **add explicit "outfitter is solely responsible" language** on listings (legality, permits, CITES, import). Extends the existing footer due-diligence disclaimer to a listing-level notice, emphasized on dangerous-game species.
5. **Agent account type** — **Yes, add an `agent` account type** (third role alongside hunter/outfitter). Requires: `profiles` role CHECK constraint update to allow `agent`, third toggle on signup, redirect/dashboard handling, `createProfile` type update.

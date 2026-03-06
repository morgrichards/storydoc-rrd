# Story Doctor Monorepo

Story Doctor is now a content-first foundation built from the `get-convex/turbo-expo-nextjs-clerk-convex-monorepo` template.

This phase focuses on backend/content modeling and simple prototypes, not polished UI or production auth/media pipelines.

## Monorepo Structure

- `apps/web`: Next.js browser prototype + minimal admin CRUD pages.
- `apps/native`: Expo placeholder screen that connects to Convex and fetches categories.
- `packages/backend`: Convex schema, queries, mutations, and demo seed data.

## Implemented In This Phase

### 1. Story Doctor Convex data model

Tables in `packages/backend/convex/schema.ts`:

- `languages`
  - `code`, `name`, `active`, `sortOrder`
- `categories`
  - `slug`, `title`, `description`, `iconKey`, `active`, `sortOrder`
- `videos`
  - `slug`, `title`, `description`, `categoryId`, `durationSeconds`, `thumbnailUrl`, `active`, `sortOrder`
- `videoVariants`
  - `videoId`, `languageCode`, `videoUrl`, `audioUrl`, `subtitleUrl`, `version`, `active`

Design support for future delivery modes:

- Separate per-language video files (`videoUrl` present per variant)
- Shared animation with language-specific audio/subtitles (`videoUrl` can be `null`, with `audioUrl` set)

### 2. Convex queries and mutations

Implemented modules:

- `convex/languages.ts`
- `convex/categories.ts`
- `convex/videos.ts`
- `convex/videoVariants.ts`
- `convex/seed.ts`

Includes:

- List active categories
- List videos by category
- Get one video with all variants
- List languages
- CRUD for categories, videos, and video variants
- CRUD for languages (admin convenience)
- Seed mutation: `seed.seedStoryDoctorData`

### 3. Realistic demo seed content

Seed behavior in `packages/backend/convex/seed.ts`:

- 6 categories
- 20 videos
- 6 languages (`en`, `es`, `fr`, `ar`, `sw`, `vi`)
- English on all videos
- Non-English intentionally partial for fallback testing
- Placeholder thumbnail/video/audio/subtitle URLs

### 4. Shared types/utilities

Shared Story Doctor definitions in `packages/backend/convex/storyDoctorShared.ts`:

- `Language`, `Category`, `Video`, `VideoVariant`, `VideoWithVariants`
- `DEFAULT_LANGUAGE_CODE`
- `normalizeLanguageCode`
- `getLanguageFallbackChain`
- `pickVariantForLanguage`

### 5. Next.js prototype (browser-first)

Implemented routes in `apps/web/src/app`:

- `/`: category browser from Convex
- `/category/[slug]`: videos in category
- `/video/[slug]`: metadata + available variants + placeholder player area

Language selector/filter state is included to demonstrate language-aware structure and variant selection.
Category and video views also surface fallback behavior when requested language variants are missing.

### 6. Minimal admin pages

Implemented in `apps/web/src/app/admin`:

- `/admin/languages`
- `/admin/categories`
- `/admin/videos`
- `/admin/video-variants`
- `/admin` (navigation + reseed trigger)

Admin UI is intentionally basic but now uses proper create/update forms and in-page two-step delete confirmation.

### 7. Expo app retained and wired to Convex

`apps/native/App.tsx` now renders a simple placeholder screen that fetches active categories from Convex.

### 8. Example note-taking/AI flow removed

Removed old note/summary template logic from active app/backend flow.

## Deferred Intentionally

- Polished final UI and kiosk-grade UX
- Full Clerk auth flow and route protection
- Real media upload/download/transcoding/sync
- Production fallback and caching strategy across web/native
- Offline-first behavior and hardened kiosk controls

## Setup

## 1) Install

```bash
pnpm install
```

## 2) Convex deployment references

Provided environments:

- Dev: `https://acoustic-elk-437.convex.cloud`
- Prod: `https://third-gazelle-810.convex.cloud`

For Convex CLI/codegen convenience in this repo, use:

```bash
export CONVEX_DEPLOYMENT=dev:acoustic-elk-437
```

## 3) App env vars

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=https://acoustic-elk-437.convex.cloud
```

Create `apps/native/.env.local`:

```bash
EXPO_PUBLIC_CONVEX_URL=https://acoustic-elk-437.convex.cloud
```

(Clerk env vars can remain installed in template tooling, but are not required for this phase.)

## 4) Seed data

Option A: Use `/admin` and click `Reseed Demo Data`.

Option B: Run via CLI:

```bash
cd packages/backend
CONVEX_DEPLOYMENT=dev:acoustic-elk-437 npx convex run seed:seedStoryDoctorData '{"resetExisting": true}'
```

## 5) Run apps

```bash
pnpm dev
```

## Validation Run

Verified during this phase:

- `pnpm typecheck`
- `pnpm --filter web-app build`

Both passed.

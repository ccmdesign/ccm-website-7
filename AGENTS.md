# Repository Guidelines

## Project Structure & Module Organization
Nuxt 3 drives the site with route components in `pages/` (one `.vue` per URL) and reusable UI blocks inside `components/` (PascalCase). Layout shells live in `layouts/`, runtime plugins in `plugins/`, helpers in `utils/`, and Markdown or JSON entries for @nuxt/content in `content/` (shaped by `content.config.ts`). Static assets stay in `public/`, server routes in `server/`, and integration suites belong in `tests/`.

## Build, Test & Development Commands
- `npm run dev`: start the hot-reloading dev server on `http://localhost:3000`.
- `npm run prebuild`: execute `nuxt prepare` to refresh generated types before CI or releases.
- `npm run build`: create the optimized production bundle in `dist/`.
- `npm run preview`: serve the built bundle locally for smoke tests.
- `npm run generate`: emit a fully static version for edge/CDN hosting.
- `npx nuxi test [--watch|--dev]`: run @nuxt/test-utils suites living in `tests/`.

## Coding Style & Naming Conventions
ESLint extends the Nuxt preset (`eslint.config.mjs`); run `npx eslint . --ext .ts,.vue --fix` before pushing. Stick to two-space indentation, `<script setup lang="ts">`, and Composition API helpers. Name components with PascalCase (e.g., `HeroBanner.vue`), composables as `useFeature.ts`, and content slugs that mirror directory paths such as `content/events/2024-launch.md`.

## Testing Guidelines
`@nuxt/test-utils` powers integration tests, so add `.spec.ts` files under `tests/feature-name/` to keep suites organized. Each UI-impacting change should ship with at least one happy-path spec plus error-state coverage when forms or validation change. Run `npx nuxi test --watch` locally and note the exact command in PR descriptions; CI mirrors the same command without `--watch`.

## Commit & Pull Request Guidelines
Commits stay short and imperative (`Add hero carousel`, `Remove legacy nav`), so keep that voice and squash fixups before merging. Pull requests must describe the change, link the related issue, attach before/after screenshots for visual tweaks, and list the commands you ran (`npm run build`, `npx nuxi test`). Mention any content migrations or env variable updates in the PR body, and never commit `dist/`, `.env`, or `node_modules/`.

## Content & Configuration Tips
Store keys in `.env`, surface them through Nuxt runtime config, and document new variables so deploys stay reproducible. Keep user-facing copy in `content/`, updating `content.config.ts` whenever you add front-matter fields. When touching SQLite-backed features (`better-sqlite3`), include lightweight schema notes or scripts under `_process/` to help other agents replay changes.

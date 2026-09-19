# AGENTS.md

Repository guidance for coding agents working in this Hugo blog.

## 1) Repo Snapshot

- Static site built with Hugo (extended), no Node app/runtime in this repo.
- Main app areas:
  - `content/` (Markdown pages and posts; single English site, individual posts may be written in Korean)
  - `layouts/` (Hugo templates and partials)
  - `assets/` (CSS, JS, SVG)
  - `hugo.toml` (site configuration)
  - `.github/workflows/hugo.yml` (CI build/deploy)
- Existing AGENTS file did not exist at time of writing.

## 2) Required Commands

### Environment checks

- Verify Hugo is installed and extended:
  - `hugo version`

### Local development

- Start local server (drafts enabled, fixed localhost URL):
  - `hugo server -D --baseURL http://localhost:1313/ --appendPort=false`

### Production build

- Build optimized output:
  - `hugo --minify`

### CI reference

- GitHub Actions build also runs Hugo with Pages base URL:
  - `hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"`
- CI file: `.github/workflows/hugo.yml`

## 3) Lint/Test Reality (Important)

- No dedicated lint command is configured in this repository.
- No dedicated automated test framework is configured in this repository.
- No `package.json`, `Makefile`, `pytest`, `go test`, or similar test runner config is present.

### What to run for validation instead

- Always run full static build after edits:
  - `hugo --minify`
- For interactive verification:
  - `hugo server -D --baseURL http://localhost:1313/ --appendPort=false`

### "Single test" equivalent in this repo

- There is no true single-test command because no test runner exists.
- Closest equivalent is targeted page validation:
  1. Run local server.
  2. Open only the changed route (example: `/posts/<slug>/` or `/ko/posts/<slug>/`).
  3. Confirm rendering, assets, and console-free JS behavior.

## 4) Formatting and Style Baseline

### General

- Preserve existing file style; this codebase is lightweight and manually formatted.
- Use UTF-8 for content; Korean text is expected in Markdown files.
- Keep edits minimal and localized; avoid drive-by refactors.

### Indentation and spacing

- Hugo templates: mostly 2-space indentation, with trim markers (`{{- ... -}}`) used heavily.
- CSS: mostly 2-space indentation in `theme.css`; `custom.css` currently uses 4 spaces.
- JS: 2-space indentation and semicolons in `assets/js/themetoggle.js`.
- Do not reformat entire files just to normalize style differences.

### Imports / dependencies

- No JS module import system is used here.
- External resources are loaded via:
  - Hugo asset pipeline (`resources.Get`, `fingerprint`, `minify`)
  - CDN/script tags when configured (`useCDN`, giscus script)
- Keep dependency surface small; prefer existing patterns over adding new toolchains.

## 5) Hugo Template Conventions

- Reuse partials for shared UI (`head.html`, `footer.html`, `language-switcher.html`, `giscus.html`).
- Prefer Hugo built-ins and site/page variables over custom logic.
- Use guard clauses for optional values:
  - `if`, `with`, `isset`, fallback expressions via `or`.
- Keep whitespace-trimmed template delimiters where surrounding code already does so.
- Follow existing naming style for local template variables (`$about`, `$g`, `$tags`, `$menuLen`).
- For assets:
  - Use `resources.Get`
  - In production: `minify | fingerprint`
  - In non-production: `fingerprint`

## 6) Content and Front Matter Rules

- Post/page content lives in `content/`. The site is single-language (English); a Korean post
  sets `htmlLang: ko` in front matter so `<html lang>` and the `:lang(ko)` word-break rules apply.
- Front matter is primarily YAML (`---`), while archetype template uses TOML (`+++`).
- Keep front matter fields consistent with existing posts:
  - `title`
  - `date`
  - optional flags like `draft`
- Optional page params seen in templates:
  - `tldr`
  - `toc`
- Preserve permalinks when renaming or moving content.

## 7) CSS Conventions

The site runs on a small design system. Read the header comment in
`assets/css/theme.css` before touching any styling.

- `assets/css/theme.css` holds the system: two colour ramps (`--n-*` neutral,
  `--w-*` burgundy), semantic tokens built from them, the type scale, spacing,
  reset, and global chrome.
- `assets/css/custom.css` holds page modules (home, archive, post page) composed
  from those tokens. It is not an override layer.
- Never write a raw colour, font size, or spacing value in a rule. Use a semantic
  token (`--text`, `--line`, `--accent`, `--fs-body`, `--space-4`, …). If a ramp
  step is missing, add it to the ramp and document it in the table comment.
- Keep the type scale small: eight `--fs-*` steps and three weights
  (`--fw-regular` 400, `--fw-medium` 500, `--fw-bold` 700). Pick the nearest
  existing step rather than adding one.
- Burgundy is a point colour: links, active nav, small rules and labels. It is
  never used as a large fill.
- Layout is a single `.wrap` column capped at `--measure`; there is no sidebar.
- Keep responsive rules in media blocks near related components.
- Respect existing reduced-motion handling:
  - `@media (prefers-reduced-motion: reduce)`

## 8) JavaScript Conventions

- Existing JS is plain browser JS in an IIFE (no framework/build step).
- Keep browser compatibility assumptions conservative.
- Use clear constant names and small pure helper functions.
- Maintain explicit DOM null checks before event binding.
- Avoid introducing bundlers or npm-based tooling unless explicitly requested.

## 9) Naming Guidelines

- Templates/CSS classes use kebab-case (examples: `site-header`, `post-container`, `read-more`).
- JS identifiers use camelCase (`setTheme`, `currentTheme`, `toggleTheme`).
- Template locals typically use short, meaningful `$` variables.

## 10) Error Handling and Safe Changes

- This repo has little runtime error infrastructure; safety comes from defensive template checks.
- When adding optional config-driven behavior, gate it with `if`/`with` checks.
- Prefer graceful fallbacks over hard failure (see about-page fallback pattern in `layouts/index.html`).
- For external embeds/scripts, keep attributes explicit and conservative.

## 11) Files/Rules Check: Cursor and Copilot

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` found.
- If these files are added later, update this document and treat those rules as higher-priority agent instructions.

## 12) Agent Working Agreement

- Before edits: inspect related template/content/config files, not just one file.
- After edits: run `hugo --minify` and report pass/fail.
- For content/template changes: manually verify affected route(s) in local server.
- Do not introduce new frameworks, linters, or test runners without explicit user request.
- Keep commits focused and scoped to the requested change.

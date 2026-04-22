# Homepage Redesign Design

Date: 2026-04-22
Repository: `/Users/dongjaelee/Documents/blog`

## Context

The site is a Hugo blog whose homepage currently renders the `About` page content directly through `layouts/index.html`. The user wants the homepage redesigned into a modern white landing page with a gothic sans-serif feel. The requested structure is explicit:

- left side: portrait photo
- right side: personal information and news

The repository already contains a candidate portrait asset at `assets/35x45.jpg`. The user also wants a new `content/news/*.md` structure for homepage news cards, with the most recent news item being "Expecto accepted". The current multilingual setup can be ignored for this work because the user stated that it is effectively inactive.

## Goals

- Replace the homepage’s current single-column about-page rendering with a dedicated landing layout.
- Keep the homepage predominantly white, modern, and editorial rather than warm or decorative.
- Use a gothic sans-serif visual direction consistent with an academic personal site.
- Show the portrait prominently on the left.
- Show dense profile information on the right, including:
  - short introduction
  - research directions
  - education
  - publications
  - honors and awards
  - contact links
  - latest news cards
- Store news as standalone Markdown content under `content/news/`.
- Make the news section auto-update based on newest news files without hardcoding cards in templates.

## Non-Goals

- No dedicated `/news/` list page in this change.
- No full multilingual content restructuring.
- No new frontend toolchain, framework, or client-side runtime.
- No broad refactor of global templates unrelated to the homepage.

## Chosen Direction

The approved layout direction is:

- `A. Split Profile + Dense Right Rail`

This means the homepage is treated as a landing page rather than a prose article. The first screen should immediately establish identity:

- a left rail for the portrait image
- a right rail for structured academic profile content
- a news section that reads as a living update stream rather than blog posts

This direction is preferred because it matches the user’s request literally and gives the homepage a stronger visual hierarchy than the current article-like layout.

## Information Architecture

The homepage will be organized into two main columns on desktop:

1. Left rail
   - portrait image card using `assets/35x45.jpg`
   - optional short caption or affiliation line if needed, but the portrait remains the dominant element

2. Right rail
   - hero identity block
   - research summary block
   - education block
   - publications block
   - honors and awards block
   - contact block
   - news block

On smaller screens, the layout collapses into a single column:

- portrait first
- identity and summary next
- remaining sections below in the same order

## Content Strategy

The homepage continues to use `content/about.md` as the source of truth for the underlying profile content, but not by dumping the page body directly. Instead, the template will render a homepage-specific structured summary derived from approved content decisions:

- preserve the academic identity and research focus from the about page
- preserve major sections already present in the about page
- present them as landing-page cards instead of a long article body

Because the existing about page is already organized by headings such as education, publications, honors, and contact, the implementation may either:

- render hand-structured homepage sections while keeping `about.md` unchanged, or
- selectively reuse parts of existing content if Hugo parsing supports it cleanly

The preferred implementation is to keep `about.md` unchanged and encode the homepage structure directly in `layouts/index.html`, using current known content. This is more deterministic and avoids fragile Markdown section parsing in Hugo templates.

## News Model

News entries will live under:

- `content/news/*.md`

Each news file should support at least:

- `title`
- `date`
- optional `summary`
- optional `link`

Homepage rendering rules:

- query regular pages in the `news` section
- sort descending by date
- render the latest 3 entries as cards on the homepage
- use `summary` when present, otherwise fall back to `.Summary` or truncated plain content
- if `link` exists, render a direct call-to-action

Initial seeded content:

- a newest item titled exactly `Expecto accepted`

This structure allows future news additions by creating new Markdown files only.

## Template Changes

### `layouts/index.html`

Replace the current "render the About page as homepage" implementation with a dedicated homepage layout that:

- resolves the portrait asset through the Hugo asset pipeline
- renders a split landing grid
- prints curated profile sections on the right
- pulls the latest news items from `content/news/`

The template should remain defensive:

- if the portrait asset is missing, fall back to a neutral placeholder container rather than breaking layout
- if no news exists, render a lightweight empty state

### Reuse of Existing Partials

Existing global partials such as the site header and footer remain unchanged unless a minor styling adjustment is required for visual consistency. The redesign should stay localized to homepage-specific markup and homepage-specific styling hooks.

## Styling Strategy

The current visual system in `assets/css/theme.css` and `assets/css/custom.css` leans warm and slightly ornamental. The homepage redesign should shift the landing page toward a cleaner white editorial feel while preserving the overall site’s integrity.

Approved styling direction:

- predominantly white surfaces
- dark gray text
- restrained accent usage
- gothic sans-serif font stack
- subtle borders and soft shadows
- high whitespace discipline
- no flashy gradients dominating the homepage

Implementation approach:

- add homepage-specific classes rather than rewriting the entire theme
- adjust root tokens only if necessary and only when the new values still work for the rest of the site
- prefer scoped homepage rules in `assets/css/custom.css`

Key homepage style elements:

- split desktop grid with generous gap
- image card with confident radius and clean frame
- right-side cards with consistent spacing and border rhythm
- news cards visually distinct but still consistent with the rest of the information blocks
- responsive collapse around tablet/mobile widths

## Typography

The homepage should use a gothic sans-serif stack appropriate for both English and Korean-capable environments, but multilingual behavior does not need to be actively optimized in this task. The font direction should remain:

- modern sans-serif
- compact and crisp headings
- readable body copy
- stronger heading contrast than the current article view

The existing `Noto Sans KR` and `Plus Jakarta Sans` setup can be reused if it produces the intended gothic sans-serif result. If needed, the order of the font stack may be adjusted to favor the desired feel without adding a new toolchain.

## Data Flow

Homepage render flow:

1. load homepage template
2. resolve portrait asset
3. render curated profile content blocks
4. fetch latest `news` pages
5. render top news cards

This keeps runtime entirely static and Hugo-native. No client-side fetching is introduced.

## Error Handling and Fallbacks

- Missing portrait asset:
  - render an empty framed placeholder so homepage structure remains intact
- Missing news content:
  - render a short message such as "More updates soon."
- Missing optional news summary:
  - fall back to generated summary or trimmed content
- Long text overflow:
  - rely on CSS wrapping and card spacing to prevent layout breakage

## Verification Plan

Required verification after implementation:

- run `hugo --minify`
- run `hugo server -D --baseURL http://localhost:1313/ --appendPort=false`
- manually inspect the homepage route

Manual checks:

- portrait appears in the left rail
- right rail shows the requested profile sections
- latest news cards render in descending date order
- newest card is the Expecto acceptance item
- page feels predominantly white and modern
- typography reads as gothic sans-serif rather than soft or decorative
- desktop layout uses a two-column split
- mobile layout collapses cleanly without clipping

## Risks and Tradeoffs

- Hard-structuring homepage content in the template is less DRY than parsing `about.md`, but it is simpler and more robust in Hugo.
- Making the whole site whiter by changing global tokens could unintentionally affect post pages, so homepage-scoped styling is the safer default.
- Ignoring multilingual behavior is correct for current scope, but the homepage layout should avoid assumptions that would block later reactivation.

## Implementation Summary

The implementation plan should focus on three bounded changes:

1. Create a dedicated landing-page template in `layouts/index.html`
2. Add homepage-specific white editorial styling in `assets/css/custom.css` and only minimal shared token changes if needed
3. Create `content/news/` with initial Markdown entries and wire the homepage to render the newest cards automatically

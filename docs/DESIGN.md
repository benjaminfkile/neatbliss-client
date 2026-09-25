# NeatBliss site design spec

Marketing site for NeatBliss, a home cleaning business. Front end only: no database, no API, no server. Everything a non technical owner can change lives in one JSON file that the site fetches at runtime and that a hidden admin page generates for her.

Design canvas (authoritative for look and layout): https://claude.ai/artifact/9p74uXkD3pj2tjDB7VFpc9

## Hard rules

- This repo is public. No secrets, no infra identifiers, no personal data beyond the business contact info that is intentionally on the site.
- No em dashes or en dashes anywhere in site copy, code comments, or docs. Use commas, colons, or periods.
- Mobile first. Most visitors arrive from Facebook on a phone.

## Stack

- Vite + React + TypeScript (existing scaffold).
- react-router (BrowserRouter). Router basename comes from `import.meta.env.BASE_URL`.
- zod for the config schema, shared by the app and CI validation.
- vitest for unit tests, Playwright for e2e smoke.
- No UI library. Hand rolled CSS (CSS modules or plain CSS with custom properties). No Tailwind.

## Theme

- Font: Nunito (Google Fonts, weights 400 600 700 800 900), loaded from index.html. Fallback: sans-serif.
- Colors as CSS custom properties on `:root`:
  - `--navy: #16345E` (headings, structure, banner, CTA band)
  - `--navy-deep: #0F2440` (footer)
  - `--sky: #3E97C9`, `--sky-tint: #DDEFF8`
  - `--green: #2F9E77` (primary action color), `--green-tint: #E4F3E9`
  - `--bg: #F5FAFC`, `--card: #FFFFFF`, `--line: #E2EDF4`
  - `--text: #16345E`, `--text-soft: #4A5D75`, `--text-faint: #5A7390`
  - `--star: #F2B441`
- Rounded, airy look: cards radius 18 to 20px, pill buttons (radius 999px), generous padding, soft decorative circles in the hero (sky and green tints).
- Icons: inline stroke SVG (feather style), never emoji, never icon fonts.
- Logo: SVG React component `<LogoBadge>` recreating the brand badge: navy outer ring, white ring, inner circle with vertical gradient sky `#4FA8D8` to green `#7FC49A`, white house with chimney and window, navy ribbon across the middle with "NeatBliss" in white Nunito 900, white sparkle below, a few white bubbles. Header uses a small version without the ribbon next to the wordmark "NeatBliss" with "HOME CLEANING" in letter spaced green caps underneath. The real logo file replaces this later; keep the component swappable.

## Config: the single source of editable data

`public/config.json`, fetched at runtime from `${import.meta.env.BASE_URL}config.json`. A typed default config is compiled into the bundle; if the fetch fails or the JSON does not parse or validate, the app renders the defaults and logs a console warning. The app never blank screens on a bad config.

Schema (zod, in `src/config/schema.ts`, exported as `configSchema` plus the inferred `SiteConfig` type and `defaultConfig`):

```ts
{
  status: { enabled: boolean, message: string },
  business: {
    name: string,            // "NeatBliss Cleaning"
    tagline: string,         // "Come home to a little bliss."
    phone: string,           // calls, shown and used in tel: links
    textNumber: string,      // sms: links
    email: string,
    facebookUrl: string,
    serviceArea: string      // "[CITY] and nearby areas"
  },
  services: [ { title: string, description: string, included: string[] } ],  // min 1
  testimonials: [ { quote: string, name: string } ],
  admin: { githubEditUrl: string }  // used only by the admin page button
}
```

Default values are the placeholder content in this document. Bracketed values like `[PHONE NUMBER]` are intentional placeholders the owner replaces later; they must round trip through schema validation like any other string.

`tel:` and `sms:` hrefs strip every non digit from the number (keep a leading `+`). React state/context: a `ConfigProvider` exposes `{ config, source }` where source is `live | draft | defaults`; every component reads from it.

## Routes

- `/` Home
- `/services` Services
- `/quote` Get a quote (contact)
- `/7ae5fff6-e9af-4876-86b8-8dfb7a1a0811` Admin (hidden; never linked from the site; renders `<meta name="robots" content="noindex">` via a head effect)
- Unknown paths redirect to `/`.

Status banner: when `status.enabled` and message non empty, a navy bar with white 700 weight text and a small info icon at the very top of every public page (not the admin page). No dismiss button.

## Pages (copy is final unless bracketed)

### Shared chrome
- Nav (white, 1px bottom line): logo group left; links Home, Services, Testimonials, Contact; green pill button "Get a free quote" linking to `/quote`. Active link navy 800, others `#4A6482` 700. Testimonials links to `/#testimonials` (scroll to section). Mobile: logo + hamburger opening a full width menu panel with the same links stacked.
- Footer (navy deep): three columns on desktop, stacked centered on mobile. Column 1: mini logo + "NeatBliss" + blurb "Family run home cleaning serving {serviceArea}. Licensed and insured." Column 2 PAGES links. Column 3 CONTACT: phone, email, "Facebook page" link. Bottom line: "© 2026 NeatBliss Cleaning. All rights reserved." and "neatblisscleaning.com".

### Home
1. Hero: eyebrow "RESIDENTIAL CLEANING IN {serviceArea city}" (green, letter spaced; use `business.serviceArea`), h1 = `business.tagline` (56px desktop / 34px mobile, navy 900), paragraph "NeatBliss is a family run home cleaning service. Recurring cleans, deep cleans, and move in or move out cleans, all done with care by people who treat your home like their own.", buttons: green pill "Get a free quote" to `/quote`, outline navy pill "Call {phone}" as `tel:`. Right side (above text on mobile): large `<LogoBadge>`. Two soft tint circles behind, `overflow: hidden` so they never cause horizontal scroll.
2. Trust strip (white card): three items with tinted icon circles: "Family owned / Run by people who care about your home" (heart), "One year in business / And just getting started" (sparkle), "Serving {serviceArea} / And nearby areas already included in the string, so render just {serviceArea} split sensibly: label "Serving {serviceArea}"" (map pin). Stacked on mobile.
3. Services section: eyebrow SERVICES, h2 "What we can do for you", one card per `services[]`: tinted icon square (calendar, sparkles, box in order, cycling), title, description, link "See what is included" to `/services`. 3 columns desktop, stacked mobile.
4. Testimonials section (white band, `id="testimonials"`): eyebrow TESTIMONIALS, h2 "What clients say", sub "Real reviews from real homes.", one card per `testimonials[]`: five gold stars, quote, name. 3 columns desktop, stacked mobile.
5. CTA band (navy): h2 "Ready for a cleaner home?", sub "Reach out and tell us about your place. Quotes are always free, and you will always talk to a real person.", buttons: green "Call us" (tel:), outline "Text us" (sms:), outline "Message us on Facebook" (facebookUrl, new tab).

### Services
- h1 "Services", sub "Every clean comes with our full attention. Here is what each service covers, and we are happy to adjust for your home."
- One card per `services[]` with icon, title, description, divider, INCLUDED label, check list from `included[]`.
- Green note card: bold "Every home is different." then "Pricing depends on size, condition, and how often we come. Reach out for a free quote and we will figure it out together." + green pill "Get a free quote".

### Get a quote (`/quote`)
- h1 "Get a free quote", sub "No forms to fill out. Reach a real person however is easiest for you, and we will get right back to you."
- Three big tappable cards (whole card is the link): Call us (green circle phone icon, shows `phone`, "Tap to call on your phone", `tel:`), Text us (sky circle chat icon, shows `textNumber`, "Texts usually get the fastest reply", `sms:`), Message us on Facebook (navy circle icon, "Opens our Facebook page", facebookUrl new tab).
- "Prefer email?" card with `mailto:` link.
- Green card "To speed up your quote, tell us:" with checks: "What city you are in", "Beds and baths", "How often you want us", "Pets or anything special". Wraps to column on mobile.

### Admin (hidden route)
Purpose: generate a valid `config.json` for a non technical owner. It writes nothing anywhere except localStorage. Looks per the design canvas: light gray blue page, navy top bar "NeatBliss site settings" + "This page is private. Bookmark it so you can find it again.", then a 1 2 3 steps strip: "Make your changes below", "Preview to make sure it looks right", "Copy your settings and paste them into GitHub".

Cards (max width 880 centered):
1. "Message at the top of the site": toggle (labeled Showing / Hidden) for `status.enabled`, textarea for `status.message`, helper text "Use this when your schedule is full or anything else clients should know before they reach out. Turn it off and the site shows no message.", preset chips that fill the textarea: "Not accepting new clients right now", "Only monthly deep cleans available", "Booked out until [MONTH]".
2. "Business details": inputs for every `business` field with friendly uppercase labels (BUSINESS NAME, TAGLINE, PHONE (CALLS), PHONE (TEXTS), EMAIL, FACEBOOK PAGE LINK, SERVICE AREA).
3. "Services": one row per service: title input, description textarea, included list editor (one line per item, a plain textarea with one item per line is fine), red outline trash button, dashed "+ Add a service" button. At least one service must remain; disable the last trash button.
4. "Testimonials": quote textarea + name input per row, trash, "+ Add a testimonial". Helper "Copy reviews word for word from your Facebook page."

Sticky bottom bar (white, top border):
- "Preview my changes" (sky outline pill): saves the draft to localStorage key `neatbliss-draft` and navigates to `/`. While a draft exists the public site renders from the draft and shows a fixed floating pill bottom center: "Previewing your changes" + button "Back to editing" (returns to admin) + button "Discard" (clears draft). The draft never affects other visitors; it is localStorage only.
- "Copy my settings" (green pill): copies pretty printed JSON (2 space indent, trailing newline) of the current form state to the clipboard, validated through `configSchema` first; on success flips to "Copied!" for a moment. Secondary small link "download the file instead" triggers a `config.json` download.
- "Open the settings file on GitHub" (navy pill): opens `config.admin.githubEditUrl` in a new tab.
- Helper line: "After you copy: on the GitHub page, select everything in the file, paste over it, then press the green Commit changes button. The site updates about a minute later."

Form state initializes from the currently loaded config. Every mutation goes through typed state; the page can never emit invalid JSON. No routing guard, no auth: the page is harmless by design.

## Build and deploy

- GitHub Actions workflow `.github/workflows/deploy.yml`, triggers: push to `main`, `workflow_dispatch`. Jobs:
  1. validate: `npm ci`, `npm run validate:config` (a small tsx/node script that reads `public/config.json`, `JSON.parse`, then `configSchema.parse`; clear one line error on failure), `npm test` (vitest), `npm run build`.
  2. e2e: Playwright against `vite preview` of the build (chromium only).
  3. deploy: only on push to main, `actions/upload-pages-artifact` + `actions/deploy-pages`. After build, copy `dist/index.html` to `dist/404.html` (react-router deep link fallback on Pages).
- Base path: in the workflow, if `public/CNAME` exists set `VITE_BASE=/`, else `VITE_BASE=/<repo name>/` derived from `${{ github.event.repository.name }}`. `vite.config.ts`: `base: process.env.VITE_BASE ?? '/'`. Local dev stays `/`.
- A failed workflow never touches the live site; that is the safety net for a bad config paste.

## Tests

- vitest: schema accepts `defaultConfig`; rejects missing `business.name`, non array `services`, empty `services`; tel/sms sanitizer cases; admin form state to JSON round trips through the schema.
- Playwright smoke (desktop + 390px mobile viewport):
  - Home renders tagline and service titles from `config.json`.
  - Banner: shows when a test config has `status.enabled: true` with a message (use route interception to serve a modified config), absent when disabled.
  - `/services` and `/quote` render; quote page call link has a `tel:` href.
  - Admin route loads, editing the status message and clicking Preview shows the new banner text on `/` with the preview pill; Back to editing returns; the copy button produces schema valid JSON (read the clipboard or intercept).
  - Deep link: loading `/quote` directly works under `vite preview`.

## HOW-TO.md (repo root, written for the owner, not for developers)

Plain, warm, short sentences, no jargon beyond the exact GitHub button names. Sections: what this site is; how to change the message at the top (bookmark the settings page link, edit, preview, Copy my settings, Open the settings file on GitHub, select everything, paste, green Commit changes button, wait about a minute); what the email from GitHub means if the update failed (nothing changed on the site, go back and copy paste again); how to change phone number, services, or reviews (same flow). Placeholder for screenshots marked with `<!-- screenshot: ... -->` comments.

# neatbliss-client

Marketing site for NeatBliss, a family run home cleaning business. Static, front end only, hosted from GitHub Pages. Everything the owner might want to change (message banner, phone, services, testimonials) lives in one JSON file that the site fetches at runtime, and a hidden admin page generates that JSON.

## Stack

- Vite + React 19 + TypeScript
- react-router (BrowserRouter, base path derived from `import.meta.env.BASE_URL`)
- zod for the config schema, shared by the app, the unit tests, and CI validation
- vitest for unit tests, Playwright for e2e (chromium, desktop 1280 and mobile 390)
- Hand rolled CSS (CSS modules + custom properties). No UI library, no Tailwind.

## Config and admin

The single source of editable content is `public/config.json`, validated by `configSchema` in `src/config/schema.ts`. `ConfigProvider` fetches it at runtime; if the fetch or the schema check fails, the app renders `defaultConfig` and logs a warning.

The hidden admin route (`src/pages/Admin.tsx`) is a form that reads the loaded config, lets the owner edit it, previews the draft on the public site via `localStorage`, and produces a schema valid `config.json` for the owner to paste back into GitHub. See `HOW-TO.md` for the owner facing walkthrough.

## npm scripts

- `npm run dev` local dev server with HMR
- `npm run build` type check with `tsc -b` and produce the production bundle
- `npm run preview` serve the built bundle locally
- `npm test` vitest unit tests (schema, phone/sms sanitizer, service area, admin helpers, providers, page smoke)
- `npm run validate:config` parse `public/config.json` and run it through `configSchema`, exit non zero with a one line reason on failure
- `npm run e2e` build the app, start `vite preview`, run Playwright, tear down
- `npm run lint` oxlint

`VITE_BASE` overrides the router base path at build time. CI sets it to `/` when `public/CNAME` exists, else `/<repo-name>/`. Local dev stays on `/`.

## Deploy

CI is defined in `.github/workflows/deploy.yml`. Push to `main` runs the validate and e2e jobs, then deploys the built `dist/` to GitHub Pages. `dist/404.html` is a copy of `index.html` so client side routes deep link on Pages.

## More docs

- `docs/DESIGN.md` full design and behavior spec (authoritative)
- `HOW-TO.md` owner facing walkthrough for updating the site content

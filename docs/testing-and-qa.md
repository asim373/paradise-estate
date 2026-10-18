# Testing and Quality Assurance

## Tooling

| Area | Tooling | Repository command |
| --- | --- | --- |
| Static analysis | ESLint | `npm run lint` |
| Type safety | TypeScript | `npm run typecheck` |
| Build validation | Next.js | `npm run build` |
| ORM schema | Prisma | `npm run prisma:validate` |
| Browser E2E and responsive checks | Playwright / Chromium | `npm run test:e2e` |
| Accessibility scanning | axe-core through Playwright | included in `npm run test:e2e` |
| Gallery integrity | Node.js script | `npm run verify:images` |
| Isolated API/database integration | Node.js, Prisma, local PostgreSQL | `npm run test:api-integration` |
| Synthetic performance audit | Lighthouse script | `npm run test:performance` |

## Browser coverage

The Playwright suite launches a local production build and verifies the public application through Chromium. Its projects cover:

- top-level public routes, the four city routes, all eight property detail pages, and invalid-route 404 behavior;
- desktop navigation, property dropdown behavior, footer navigation, carousels, galleries, specifications, and property-specific viewing links;
- keyword search, city, type, price, and bedroom filtering, combined filters, reset behavior, URL state, and empty results;
- Contact form required-field validation, loading/disabled behavior, success and error UI states, and idempotency-key reuse in the browser client;
- desktop horizontal-overflow checks at 1920 × 1080, 1440 × 900, and 1366 × 768;
- tablet and phone emulation in portrait and landscape using iPad, Galaxy Tab, iPhone, and Pixel device profiles;
- automated axe scans on representative desktop and iPhone emulation pages, configured to fail on serious or critical violations.

Browser form submissions are intercepted for these UI tests, so they do not write to a shared database. Device results are browser emulation, not physical-device certification.

## Isolated database integration coverage

`scripts/test-api-integration.mjs` is a separate real API and persistence runner. It requires `TEST_DATABASE_URL` and rejects any target except the dedicated local PostgreSQL test database at `127.0.0.1:5432/paradise_estate_test`.

When that isolated environment is configured, it creates deterministic fixtures and tests both inquiry and viewing-request routes for valid persistence, validation failures, malformed JSON, invalid property references, idempotent replay, conflicting replay, concurrent submissions, database uniqueness, and sanitized failures. The script deletes its own fixtures and test submissions in `finally` cleanup.

The repository history records a prior isolated-database run with **45 assertions passing**. That result is historical evidence, not a substitute for rerunning the script when the protected local test credentials are unavailable.

## Catalog integrity

`npm run verify:images` verifies the gallery inventory and assignments: eight properties, eight images per property, 64 unique gallery references, 48 added images, and preservation of the original 16 images. The seed script independently verifies eight property records and 64 ordered image records after upsert.

## Validation guidance

Run the following from a configured local environment:

```bash
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
npm run verify:images
npm run test:e2e
```

Run API integration only with the dedicated local test database configuration:

```bash
npm run test:api-integration
```

Never point that integration runner at Supabase or another shared database. The script is intentionally guarded to refuse remote or unexpected test targets.

## Limits and interpretation

- Test results apply to the local code and the executed environment; this repository makes no public deployment claim.
- Lighthouse is a synthetic lab measurement, not real-user Core Web Vitals data. The repository does not claim field INP data.
- Automated axe scans supplement, rather than replace, manual assistive-technology review.
- Production distributed rate limiting and trusted client identity are deliberately out of scope until a hosting platform is selected.

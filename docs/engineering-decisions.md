# Engineering Decisions

## Shared property-domain boundary

**Challenge:** Pages and API handlers both need city-safe lookup, filter parsing, public serialization, and safe errors.

**Constraints:** Duplicate query logic can drift, and database records include JSON specifications and string values that require runtime validation.

**Implementation:** `src/lib/property-api.ts` centralizes supported city/property-type checks, filter parsing, Prisma `where` construction, property resolution, record serialization, bounded JSON parsing, and public API error mapping.

**Trade-off:** This file is intentionally a dense domain boundary, but it avoids multiple incompatible versions of the public property contract.

**Evidence:** All property listing and detail API handlers import the shared utilities; browser tests cover search, city routes, invalid routes, and property details.

## Database-enforced ordering and idempotency

**Challenge:** Gallery order and public form retries need consistency under repeated requests.

**Constraints:** A visual order cannot rely on client behavior, and timing-based duplicate suppression is unreliable under concurrent requests.

**Implementation:** `PropertyImage` uses a compound unique key of property ID and sort order. Inquiry and viewing-request models use unique optional idempotency keys and payload hashes; the routes handle initial writes, matching replays, and conflicting key reuse.

**Trade-off:** Clients must send a stable idempotency key for retry guarantees. The Contact form manages that key within its approved submission flow.

**Evidence:** The Prisma schema and `20261015120000_security_integrity` migration define the unique indexes; the isolated API integration runner exercises replay, conflict, and concurrency paths.

## Defensive public write endpoints

**Challenge:** Public forms accept untrusted JSON without an authentication layer.

**Constraints:** The project must not leak database errors, accept unbounded request bodies, or misinterpret invalid property references.

**Implementation:** Route handlers validate fields and property references, bound streamed JSON to 32 KB, return 400/409/413/429/500-class responses as appropriate, and use sanitized fallback error messages.

**Trade-off:** The repository’s rate limiter is process-local while hosting is undecided. This protects a single local runtime but is not a substitute for a shared production limiter with trusted platform identity.

**Evidence:** `src/app/api/inquiries/route.ts`, `src/app/api/viewing-requests/route.ts`, and `src/lib/property-api.ts`; the API integration runner checks validation and redaction behavior.

## Responsive carousel as a shared interaction

**Challenge:** Eight-image property galleries need to work without turning mobile property pages into long vertical image stacks.

**Constraints:** Existing image order, descriptive alt text, loading behavior, keyboard support, and touch interaction had to be preserved.

**Implementation:** A shared carousel uses the existing ordered gallery data, Previous/Next controls, wraparound behavior, focusable keyboard navigation, swipe interaction, a visible image count, and responsive captions.

**Trade-off:** There is no thumbnail strip, modal, or autoplay; the interaction stays focused and avoids additional dependency weight.

**Evidence:** `PropertyCarousel` is exercised in functional and responsive Playwright tests across desktop and emulated touch devices.

## URL-backed discovery state

**Challenge:** Filtered property discovery should remain shareable and predictable when navigating between pages.

**Constraints:** The existing luxury UI should not gain a separate client-side data store or duplicate backend filter logic.

**Implementation:** Search/filter controls use URL parameters, and the server parses only supported values before querying. Reset removes the filter state, while invalid or empty results are handled as explicit states.

**Trade-off:** Filter interactions involve navigation rather than an opaque in-memory-only state, which improves linkability and browser-history consistency.

**Evidence:** Search/filter behavior is covered by functional Playwright checks; parsing and Prisma query construction are centralized in the property-domain module.

## Local-first verification boundaries

**Challenge:** The project needs credible verification without sending test submissions to a production database or claiming a public deployment.

**Constraints:** Browser tests should be repeatable, and database tests must not target Supabase production.

**Implementation:** Playwright builds and starts the application locally. Browser form tests intercept writes, while a separate integration script has an explicit local-database guard and deterministic cleanup.

**Trade-off:** Browser UI testing and real database persistence testing are intentionally separate. The latter requires protected local test credentials and is not silently replaced with production access.

**Evidence:** `playwright.config.ts`, `e2e/*.spec.ts`, and `scripts/test-api-integration.mjs`.

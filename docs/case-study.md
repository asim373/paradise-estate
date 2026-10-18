# Paradise Estate: Technical Case Study

## 1. Project overview

Paradise Estate is a full-stack portfolio implementation for a premium real estate discovery experience. It demonstrates how a polished editorial interface can coexist with typed server-side property data, responsive interactions, public API routes, and a relational PostgreSQL model.

The project is not a commercial brokerage or deployed product. All listings, imagery, addresses, and editorial copy are fictional demonstration content.

## 2. Problem and objective

The implementation explores a familiar content-rich product problem: make a small, curated catalog easy to browse without sacrificing visual presentation. The objective was to support city browsing, search and combined filters, detailed property storytelling, accessible galleries, and an inquiry journey while retaining a restrained luxury design system.

## 3. Technology stack

- **Next.js 16 App Router** for route organization, server rendering, metadata, API handlers, and static asset delivery.
- **React 19 and TypeScript** for component composition, typed props, and explicit frontend/backend data contracts.
- **Tailwind CSS 4** for the existing responsive visual system.
- **Prisma 7 and PostgreSQL** for persisted catalog records, ordered images, inquiries, and viewing requests.
- **Playwright and axe-core** for browser workflows, responsive emulation, and automated accessibility scanning.

## 4. Architecture and implementation

Public App Router pages handle the homepage, catalog, city collections, property details, About, Communities, and Contact routes. Shared components provide navigation, filtering, galleries, structured specifications, and form behavior. Client-side state is used only where interaction requires it; property records and page-level content are read server-side through Prisma.

The catalog supports the four approved cities, city-safe dynamic property routes, keyword search, property type, price, and bedroom filters. URL parameters preserve filter state. Property pages render ordered eight-image galleries, editorial content, specifications, amenities, and a property-specific contact journey.

The public APIs expose listing, city, and city/slug detail endpoints, plus separate inquiry and viewing-request write endpoints. The data-access layer validates public filters and validates persisted property data before it is serialized back to the UI.

## 5. Engineering decisions

- **One domain layer for pages and APIs:** `src/lib/property-api.ts` centralizes property query construction, record serialization, and public error handling.
- **Database-backed catalog with a deterministic seed:** The approved eight-property source is seeded idempotently; the seed verifies 64 ordered image records.
- **Public-write safeguards:** Form endpoints enforce field validation, a 32 KB streamed JSON-body limit, safe error responses, and database-backed idempotency keys.
- **Responsive interaction instead of duplicated layouts:** The shared carousel handles button, keyboard, and touch interaction across desktop and mobile layouts without changing gallery data.
- **Explicit scope boundary:** No login, billing, CRM, brokerage claims, or production deployment is implied by the implementation.

## 6. Challenges and solutions

### Consistent responsive discovery controls

Filtering must remain useful from desktop grids through phone layouts. The implementation represents filter state as URL query parameters, validates values on the server, and tests reset, combined-filter, empty-state, and navigation behavior in browser automation.

### Keeping catalog data safe at the API boundary

PostgreSQL records contain JSON specifications and enum-like domain values. The serializer validates city identifiers, property types, gallery data, and nested specifications before public output, avoiding a silent mismatch between persisted content and the UI contract.

### Public form retries without duplicate records

The APIs hash request payloads and combine the result with a unique idempotency key. A matching replay receives the prior result; a reused key with a different payload receives a conflict response. This is enforced by database uniqueness rather than timing heuristics alone.

### Verifying visual behavior without a public deployment

The Playwright configuration builds and starts the application locally, then runs functional, responsive, desktop overflow, and axe accessibility projects against Chromium. The suite deliberately intercepts form writes for browser UI testing; separate isolated-database integration testing covers real persistence when the local test credentials are available.

## 7. Testing and quality assurance

The repository includes Playwright coverage for navigation, routes, filters, galleries, contact UI, desktop layout, responsive device emulation, and axe scans. It also includes a guarded local PostgreSQL integration runner that refuses non-local targets before exercising the actual route handlers and Prisma persistence. ESLint, TypeScript, Prisma schema validation, production builds, and gallery assignment verification complement browser tests.

See [Testing & Quality Assurance](testing-and-qa.md) for test boundaries and commands.

## 8. Project limitations

- Listings and imagery are fictional portfolio material, not real inventory.
- The project is intentionally not publicly deployed.
- The Contact UI uses the inquiry endpoint; no separate public viewing-request UI is implemented.
- Hosting-specific trusted client identity and distributed rate limiting remain future production-launch work.
- Browser device checks use emulation, not physical-device certification.

## 9. Engineering outcomes

Paradise Estate demonstrates practical full-stack skills: App Router architecture, typed React work, relational data modeling, public API input validation, idempotent database writes, responsive UI implementation, test automation, accessibility-oriented browser checks, and clear operational boundaries around a portfolio project.

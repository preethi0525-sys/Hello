# E-commerce website testing suite

A Playwright + TypeScript end-to-end suite for validating a storefront across Chromium, Firefox, WebKit, and a mobile Chromium profile. It covers discovery, product details, cart and checkout validation, account flows, accessibility, and resilient rendering.

## Quick start

1. Install Node.js 20 or newer.
2. Install dependencies and browsers:

   ```bash
   npm install
   npx playwright install
   ```

3. Copy `.env.example` to `.env` and set `BASE_URL` to a **dedicated local or staging test store**. Set `TEST_PRODUCT_PATH` to an available product route. Optionally add dedicated `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` credentials.
4. Add a dotenv loader if you want Playwright to read `.env` automatically, or export those environment variables in your shell/CI.
5. Run `npm test`; run `npm run test:smoke` for the core smoke checks, `npm run test:accessibility` for accessibility checks, or `npm run test:ui` for Playwright's UI runner.

The suite does not create an order or submit payment. Run it only against a non-production environment. Product/cart tests mutate the test shopper's cart; use an isolated test account/store and reset data between CI runs as needed.

## Required storefront test contract

The tests use stable `data-testid` attributes so selectors are not coupled to visual styling. Add these IDs to the corresponding components, or update selectors in `tests/` to match your application. A product listing route is expected at `/collections/all`; adjust paths in the specs if your store differs.

| Area | Test IDs / route expectations |
| --- | --- |
| Layout and search | `site-logo`, `site-search`, `main-navigation`, `product-card`, `/search`, `search-results`, `search-empty-state` |
| Catalog | `/collections/all`, `product-grid`, `sort-select` (option label matching “price low”), product card `data-product-id` |
| Product | `product-page`, `product-name`, `product-price`, `product-image`, `quantity-input`, `add-to-cart-button`, `cart-error`, `cart-confirmation`, `cart-count`, optional `product-variant` (`aria-pressed`), `stock-status` |
| Cart and checkout | `/cart`, `cart-line`, `line-item-price`, `cart-item-quantity`, `cart-subtotal`, `remove-item`, `cart-empty-state`, `continue-shopping`, `discount-code`, `apply-discount`, `discount-error`, `/checkout`, `checkout-form`, `place-order-button`, `checkout-errors`, `checkout-confirmation`, `order-summary`, `order-total` |
| Account | `/account/login`, `login-form`, `login-email`, `login-password`, `login-submit`, `login-errors`, `/account/register`, `register-form`, `register-submit`, `register-errors`, `privacy-policy-link`; authenticated view: `account-dashboard`, `account-orders` |
| Errors | Unknown paths return HTTP 404 and render `not-found-page` plus `continue-shopping` |

Use the IDs as semantic hooks, not as user-facing content. Keep controls keyboard-operable and provide accessible labels; axe checks test WCAG 2.1 A/AA rules on core routes. The optional out-of-stock test uses `?test-stock=out`; implement that test-only behavior in your staging fixture or adapt the test to a known out-of-stock product.

## Coverage and extension points

- **Storefront:** home navigation, catalog display/sorting, matching and no-result search.
- **Product:** details, variant selection, quantity validation, stock state, add-to-cart confirmation.
- **Cart and checkout:** line-item updates/removal, empty state, invalid promotion, required-field validation, pre-submit total/summary.
- **Account:** invalid and missing login inputs, optional seeded-user sign-in, registration validation and privacy link.
- **Accessibility:** serious/critical axe violations and keyboard focus visibility on core templates.
- **Resilience:** 404 recovery, safe search rendering, mobile horizontal overflow.
- **Cross-browser:** desktop Chromium, Firefox, WebKit; mobile Chromium on core shopping flows.

Recommended additions for a specific application include payment-provider sandbox tests, tax/shipping rules, inventory concurrency, API contract checks, email verification, localization/currency, and visual regression. Keep payment credentials and test-user secrets in CI secret storage, never commit them.

## CI artifacts

On CI failures, Playwright retains traces, screenshots, and videos under `test-results/`; the HTML report is generated at `playwright-report/`. Both directories are git-ignored. Upload them as CI artifacts to make failures diagnosable.

# E-commerce website testing suite + sample store

This repository includes a small sample storefront and a Playwright + TypeScript test suite. The demo shop gives the tests a local target; it is for practice only and does not process payments or create real orders.

## Run on Windows / VS Code

1. Open this repository folder in VS Code, then choose **Terminal → New Terminal**.
2. Install dependencies and browser engines:

   ```powershell
   npm install
   npx playwright install
   ```

3. Run all browser tests:

   ```powershell
   npm test
   ```

   Playwright starts the sample store at `http://127.0.0.1:3000` automatically for the default test run.

To view the store yourself, open a second terminal and run `npm start`, then visit `http://127.0.0.1:3000` in your browser. Stop the store with **Ctrl+C**. For a visible browser test run use `npm run test:headed`; use `npm run test:ui` for Playwright's UI.

## Sample store features

- Home page and product catalog with sorting
- Search with matching and empty-result states
- Product details, color selection, quantity validation, stock status, add-to-cart
- Cart with quantity changes, remove item, subtotal, and invalid discount feedback
- Checkout form validation and order summary; no payment is submitted
- Demo login and registration validation
- Not-found page, keyboard focus indicator, and responsive mobile layout

The cart uses browser local storage. The demo login is not real authentication: any syntactically valid email and non-empty password will show a demo account page. Never enter real personal or payment information.

## Test commands

- `npm test` — run the full cross-browser suite
- `npm run test:smoke` — core smoke tests
- `npm run test:accessibility` — accessibility checks
- `npm run test:headed` — run tests with visible browser windows
- `npm run report` — open the generated HTML report

The tests use `data-testid` selectors and the routes implemented by the sample shop. Test failures save traces, screenshots, and videos under `test-results/`; the HTML report is in `playwright-report/`.

This is a practice sample, not a production-ready commerce system. It has no server-side order handling, payment, inventory, or real user accounts.

import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  ...(baseURL === 'http://127.0.0.1:3000'
    ? {
        webServer: {
          command: 'npm run start',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: !isCI,
          timeout: 30_000,
        },
      }
    : {}),
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    {
      name: 'mobile-chromium',
      testMatch: /storefront\.spec\.ts|product\.spec\.ts|cart-checkout\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});

import { expect, test } from '@playwright/test';

test.describe('Resilience and safe rendering', () => {
  test('unknown route presents a recoverable not-found page', async ({ page }) => {
    const response = await page.goto('/this-route-should-not-exist-928374');
    expect(response?.status()).toBe(404);
    await expect(page.getByTestId('not-found-page')).toBeVisible();
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
  });

  test('search query is rendered as text rather than executable markup', async ({ page }) => {
    await page.goto('/');
    const payload = '<img src=x onerror=alert(1)>';
    await page.getByTestId('site-search').fill(payload);
    await page.getByTestId('site-search').press('Enter');
    await expect(page.getByTestId('search-results')).toBeVisible();
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
    await expect(page.getByTestId('search-query')).toContainText(payload);
  });

  test('mobile viewport has no horizontal page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });
});

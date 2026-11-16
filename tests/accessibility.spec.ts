import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  { name: 'home', path: '/' },
  { name: 'catalog', path: '/collections/all' },
  { name: 'product', path: `/${process.env.TEST_PRODUCT_PATH ?? 'products/sample-product'}` },
  { name: 'cart', path: '/cart' },
];

for (const route of routes) {
  test(`@a11y ${route.name} has no critical WCAG 2.1 A/AA violations`, async ({ page }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}

test('@a11y keyboard users can reach the primary navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await expect(page.locator(':focus')).toHaveAttribute('href', /./);
});

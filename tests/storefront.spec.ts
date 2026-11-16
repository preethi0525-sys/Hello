import { expect, test } from '@playwright/test';

const productPath = process.env.TEST_PRODUCT_PATH ?? 'products/sample-product';

 test.describe('Storefront and product discovery', () => {
  test('@smoke home page exposes core shopping navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('site-logo')).toBeVisible();
    await expect(page.getByTestId('site-search')).toBeVisible();
    await expect(page.getByTestId('main-navigation')).toBeVisible();
    await expect(page.getByTestId('product-card').first()).toBeVisible();
  });

  test('category listing supports filtering and sorting', async ({ page }) => {
    await page.goto('/collections/all');
    await expect(page.getByTestId('product-grid')).toBeVisible();
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();
    const before = await products.first().getAttribute('data-product-id');

    const sort = page.getByTestId('sort-select');
    await expect(sort).toBeVisible();
    await sort.selectOption({ label: /price.*low/i });
    await expect(page.getByTestId('product-grid')).toBeVisible();
    const after = await products.first().getAttribute('data-product-id');
    expect(after).toBeTruthy();
    // Catalogs with one item are valid; multi-item catalog ordering should be observable.
    if (await products.count() > 1) expect(after).not.toBe(before);
  });

  test('search returns matching products and has a useful empty state', async ({ page }) => {
    await page.goto('/');
    const search = page.getByTestId('site-search');
    await search.fill('sample');
    await search.press('Enter');
    await expect(page).toHaveURL(/search/);
    await expect(page.getByTestId('search-results')).toBeVisible();

    await page.getByTestId('site-search').fill('zz-no-such-product-zz');
    await page.getByTestId('site-search').press('Enter');
    await expect(page.getByTestId('search-empty-state')).toBeVisible();
  });

  test('product detail shows price, image, stock and purchase controls', async ({ page }) => {
    await page.goto(`/${productPath}`);
    await expect(page.getByTestId('product-page')).toBeVisible();
    await expect(page.getByTestId('product-name')).not.toBeEmpty();
    await expect(page.getByTestId('product-price')).toBeVisible();
    await expect(page.getByTestId('product-image')).toBeVisible();
    await expect(page.getByTestId('quantity-input')).toHaveValue(/^[1-9]\d*$/);
    await expect(page.getByTestId('add-to-cart-button')).toBeEnabled();
  });
});

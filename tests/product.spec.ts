import { expect, test } from '@playwright/test';

const productPath = process.env.TEST_PRODUCT_PATH ?? 'products/sample-product';

test.describe('Product detail and purchase options', () => {
  test('variant selection updates the selected option and purchase state', async ({ page }) => {
    await page.goto(`/${productPath}`);
    const variants = page.getByTestId('product-variant');
    test.skip(await variants.count() === 0, 'This product has no selectable variants.');

    await variants.last().click();
    await expect(variants.last()).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('product-price')).toBeVisible();
  });

  test('quantity is constrained and adding to cart gives confirmation', async ({ page }) => {
    await page.goto(`/${productPath}`);
    const quantity = page.getByTestId('quantity-input');
    await quantity.fill('0');
    await page.getByTestId('add-to-cart-button').click();
    await expect(page.getByTestId('cart-error')).toBeVisible();

    await quantity.fill('1');
    await page.getByTestId('add-to-cart-button').click();
    await expect(page.getByTestId('cart-confirmation')).toBeVisible();
    await expect(page.getByTestId('cart-count')).toContainText(/\d+/);
  });

  test('out-of-stock product cannot be added to cart', async ({ page }) => {
    await page.goto(`/${productPath}?test-stock=out`);
    const addButton = page.getByTestId('add-to-cart-button');
    test.skip(await addButton.count() === 0, 'Product template has no add-to-cart control.');
    await expect(addButton).toBeDisabled();
    await expect(page.getByTestId('stock-status')).toContainText(/out of stock|sold out/i);
  });
});

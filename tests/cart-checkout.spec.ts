import { expect, test } from '@playwright/test';

const productPath = process.env.TEST_PRODUCT_PATH ?? 'products/sample-product';

async function addOneItem(page: import('@playwright/test').Page) {
  await page.goto(`/${productPath}`);
  await page.getByTestId('add-to-cart-button').click();
  await expect(page.getByTestId('cart-confirmation')).toBeVisible();
}

test.describe('Cart and checkout', () => {
  test('cart reflects add, quantity update, and removal', async ({ page }) => {
    await addOneItem(page);
    await page.goto('/cart');
    const line = page.getByTestId('cart-line').first();
    await expect(line).toBeVisible();
    await expect(line.getByTestId('line-item-price')).toBeVisible();

    const quantity = line.getByTestId('cart-item-quantity');
    await quantity.fill('2');
    await quantity.press('Enter');
    await expect(quantity).toHaveValue('2');
    await expect(page.getByTestId('cart-subtotal')).toBeVisible();

    await line.getByTestId('remove-item').click();
    await expect(page.getByTestId('cart-empty-state')).toBeVisible();
  });

  test('empty cart provides a path back to shopping', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByTestId('cart-empty-state')).toBeVisible();
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
  });

  test('invalid discount code is rejected without changing totals', async ({ page }) => {
    await addOneItem(page);
    await page.goto('/cart');
    const subtotal = await page.getByTestId('cart-subtotal').innerText();
    await page.getByTestId('discount-code').fill('NOT-A-REAL-CODE');
    await page.getByTestId('apply-discount').click();
    await expect(page.getByTestId('discount-error')).toBeVisible();
    await expect(page.getByTestId('cart-subtotal')).toHaveText(subtotal);
  });

  test('checkout validates required fields and does not submit an incomplete order', async ({ page }) => {
    await addOneItem(page);
    await page.goto('/checkout');
    await expect(page.getByTestId('checkout-form')).toBeVisible();
    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('checkout-errors')).toBeVisible();
    await expect(page.getByTestId('checkout-confirmation')).toHaveCount(0);
  });

  test('order summary is visible before payment submission', async ({ page }) => {
    await addOneItem(page);
    await page.goto('/checkout');
    await expect(page.getByTestId('order-summary')).toBeVisible();
    await expect(page.getByTestId('order-total')).toBeVisible();
    // Deliberately do not submit payment or place a real order in this suite.
  });
});

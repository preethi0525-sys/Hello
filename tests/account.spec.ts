import { expect, test } from '@playwright/test';

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test.describe('Account and authentication', () => {
  test('login form validates missing and malformed credentials', async ({ page }) => {
    await page.goto('/account/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-errors')).toBeVisible();

    await page.getByTestId('login-email').fill('not-an-email');
    await page.getByTestId('login-password').fill('invalid-password');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-errors')).toBeVisible();
    await expect(page).not.toHaveURL(/account\/?$/);
  });

  test('configured test user can sign in and access account', async ({ page }) => {
    test.skip(!email || !password, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD for this test.');
    await page.goto('/account/login');
    await page.getByTestId('login-email').fill(email!);
    await page.getByTestId('login-password').fill(password!);
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('account-dashboard')).toBeVisible();
    await expect(page.getByTestId('account-orders')).toBeVisible();
  });

  test('registration form includes consent and required-field validation', async ({ page }) => {
    await page.goto('/account/register');
    await expect(page.getByTestId('register-form')).toBeVisible();
    await page.getByTestId('register-submit').click();
    await expect(page.getByTestId('register-errors')).toBeVisible();
    await expect(page.getByTestId('privacy-policy-link')).toBeVisible();
  });
});

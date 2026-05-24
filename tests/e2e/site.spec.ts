import { test, expect } from '@playwright/test';

test('Home page loads and has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Habita.vc/i);
});

test('Navigation works', async ({ page }) => {
  await page.goto('/');
  // Assume there is a link to Blog or Portal
  const blogLink = page.getByRole('link', { name: /blog/i });
  if (await blogLink.isVisible()) {
    await blogLink.click();
    await expect(page).toHaveURL(/.*blog/);
  }
});

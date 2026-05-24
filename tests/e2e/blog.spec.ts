import { test, expect } from '@playwright/test';

test('Blog page loads', async ({ page }) => {
  const response = await page.goto('/blog');
  // Just check it doesn't 404 or 500
  expect(response?.status()).toBeLessThan(400);
});

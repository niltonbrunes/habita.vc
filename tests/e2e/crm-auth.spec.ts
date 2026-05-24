import { test, expect } from '@playwright/test';

test('CRM Login page works', async ({ page }) => {
  const response = await page.goto('/login');
  expect(response?.status()).toBeLessThan(400);
  
  const emailInput = page.getByLabel(/email/i).first();
  if (await emailInput.isVisible()) {
    await emailInput.fill('test@habita.vc');
    const passInput = page.getByLabel(/senha/i).first();
    if (await passInput.isVisible()) {
      await passInput.fill('password123');
    }
  }
});

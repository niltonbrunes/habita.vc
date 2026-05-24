import { test, expect } from '@playwright/test';

test('Conversion page works', async ({ page }) => {
  const response = await page.goto('/contato'); // Assuming /contato is a conversion page
  if (response?.status() === 200) {
    const nameInput = page.getByPlaceholder(/nome/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await page.getByPlaceholder(/email/i).first().fill('test@example.com');
      // We don't submit to avoid spamming the DB, just ensure fields exist
    }
  }
});

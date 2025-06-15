import { test, expect } from '@playwright/test';
import { E2EUtils } from './E2E_utils';

test('Show PyScript Terminal', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
  await page.waitForTimeout(2000);
  const pyscriptTerminal = page.locator('py-terminal')
  await expect(pyscriptTerminal).toHaveClass('hidden');
  await e2e.toggleTerminal()
  await expect(pyscriptTerminal).not.toHaveClass('hidden');
  await page.waitForTimeout(2000);
  await e2e.toggleTerminal()
  await expect(pyscriptTerminal).toHaveClass('hidden');
});
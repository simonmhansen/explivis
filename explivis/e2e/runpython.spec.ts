import { test, expect } from '@playwright/test';
import { E2EUtils } from './E2E_utils';

test('Ryn Python can print', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
  // Setup Terminal
  await page.waitForTimeout(2000);
  const pyscriptTerminal = e2e.terminalSelector()
  await expect(pyscriptTerminal).toHaveClass('hidden');
  await e2e.hideEditors()   // Hide editors to not obstruct node

  await e2e.addChart();
  await e2e.clickNode(0)
  const pythonCode =
`def main(parent):\nprint("Hello World")\nreturn None
`
  await e2e.hideEditors()
  await e2e.setPythonEditorText(pythonCode)
  await page.getByRole('button', { name: 'Run Python' }).click();
  await page.getByLabel('toggle python terminal').click();
  await e2e.terminalContainsText('Hello World')
});
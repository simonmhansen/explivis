import { test, expect } from '@playwright/test';
import { E2E_EXAMPLE_VIS_CODE, E2EUtils } from './E2E_utils';

test('Should embed visualisation', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
  await e2e.togglePythonEditorVisibility()
  await page.getByLabel('add chart').click();


  await e2e.clickNode(0)
  await page.getByRole('button', { name: 'Add Child' }).click();
  await e2e.dragByOffset(0, 0, 200)
  await e2e.dragByOffset(1, 0, -200)
  await e2e.clickNode(0)
  await e2e.setVisualEditorText(E2E_EXAMPLE_VIS_CODE)
  await page.getByRole('button', { name: 'Embed Visualisation' }).click();
  
  await e2e.clickNode(1)
  await e2e.setNodeVisualEditorText(1, E2E_EXAMPLE_VIS_CODE)
  await page.getByRole('button', { name: 'Embed Visualisation' }).click();
  await expect(e2e.nodeContentsSelector(0)).toBeVisible();
  await expect(e2e.nodeContentsSelector(1)).toBeVisible();
});
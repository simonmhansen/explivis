import { test, expect } from '@playwright/test';
import { E2E_EXAMPLE_VIS_CODE, E2EUtils } from './E2E_utils';

test('Clear Node Button', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await page.getByLabel('add chart').click();
  
  let nodeContents = e2e.nodeContentsSelector(0)

  // We start empty
  await expect(nodeContents).not.toBeVisible();
  
  // Embed Visualisation
  let node = e2e.nodeSelector(0)
  await node.click()
  await e2e.setVisualEditorText(E2E_EXAMPLE_VIS_CODE)
  await e2e.embedVisualisation()

  // Expect node contents to no longer be empty
  await expect(nodeContents).toBeVisible()
  
  // Click node to ensure we have its submenu open
  await e2e.clearNode(0)

  // Expect node to be empty again
  await expect(nodeContents).not.toBeVisible();

});
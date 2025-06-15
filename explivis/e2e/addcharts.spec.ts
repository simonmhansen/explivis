import { test, expect } from '@playwright/test';
import { E2EUtils } from './E2E_utils';

test('E2E Add Charts and Child Charts', async ({ page }) => {
  let e2e = new E2EUtils(page);
  await page.goto('http://localhost:5173/');
  e2e.hideEditors();
  await page.getByLabel('add chart').click();

  let node0 = e2e.nodeSelector(0);
  await expect(node0).toBeVisible();
  await node0.click();

  // Add child and assert parent is still visible
  await expect(page.getByRole('button', { name: 'Add Child' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Child' }).click();
  await expect(node0).toBeVisible();

  // Assert child is visible
  let node1 = e2e.nodeSelector(1);
  await expect(node1).toBeVisible();
  await node1.click();
  
  // Create a grandchild
  await page.getByRole('button', { name: 'Add Child' }).click();
  let node2 = e2e.nodeSelector(2);

  // All nodes should be visible still
  await expect(node0).toBeVisible();
  await expect(node1).toBeVisible();
  await expect(node2).toBeVisible();
});
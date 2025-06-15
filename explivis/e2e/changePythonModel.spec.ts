import { test, expect } from '@playwright/test';
import { E2EUtils } from './E2E_utils';

test('Clicking on nodes should change python models', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');

  await e2e.addChart()
  const mainCode = "def main(parent):\nprint(\'Hello World from node0\')\nreturn None"
  await e2e.setNodePythonEditorText(0, mainCode)

  let pythonEditor = e2e.getSimplePythonEditorTextLocator()
  await e2e.clickNode(0)
  await expect(pythonEditor).toContainText(RegExp(`.*?node0.*?`));
  
  await e2e.addChildChart(0)
  const childCode = "def main(parent):\nprint(\'Hello World from node1\')\nreturn None"
  await e2e.setNodePythonEditorText(1, childCode)

  
  await e2e.clickNode(0)
  await page.pause()
  await expect(pythonEditor).toContainText(RegExp(`.*?node0.*?`));
  await page.pause()
  await e2e.clickNode(1)
  await expect(pythonEditor).toContainText(RegExp(`.*?node1.*?`));
});

test('Simple editting of monaco works', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');

  await e2e.addChart()
  let code = "print(\'Hello from Monaco!'\)"
  await e2e.setNodePythonEditorText(0, code)

  let pythonEditor = e2e.getSimplePythonEditorTextLocator()
  await expect(pythonEditor).toContainText(RegExp(`.*?Monaco.*?`))
});
import { test, expect } from '@playwright/test';
import { E2EUtils } from './E2E_utils';

test('Clicking on nodes should change visual models', async ({ page }) => {
    let e2e = new E2EUtils(page)
    await page.goto('http://localhost:5173/');
    await e2e.addChart()

    const mainCode = `{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple scatter plot with a small local dataset.",
    "data": {
    "values": [
        { "x": 1, "y": 2 },
        { "x": 2, "y": 3 }
        ]
    },
    "mark": "point",
    "encoding": {
    "x": { "field": "x", "type": "quantitative" },
    "y": { "field": "y", "type": "quantitative" }
    }
}`

  let visualEditor = e2e.getSimpleVisualEditorTextLocator()
  await e2e.setNodeVisualEditorText(0, mainCode)
  await e2e.clickNode(0)
  await expect(visualEditor).toContainText(RegExp(`.*?3.*?`)) // There's a '3' in "y": 3

  await e2e.addChildChart(0)
  const childCode = `{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple scatter plot with a small local dataset.",
    "data": {
    "values": [
        { "x": 1, "y": 2 },
        { "x": 2, "y": 4 }
        ]
    },
    "mark": "point",
    "encoding": {
    "x": { "field": "x", "type": "quantitative" },
    "y": { "field": "y", "type": "quantitative" }
    }
}`
  await e2e.setNodeVisualEditorText(1, childCode)

  await e2e.clickNode(0)
  await expect(visualEditor).toContainText(RegExp(`.*?3.*?`)); // There's a '3' in "y": 3
  await e2e.clickNode(1)
  await expect(visualEditor).toContainText(RegExp(`.*?4.*?`)); // There's a '4' in "y": 4
});
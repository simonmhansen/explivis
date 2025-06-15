import { test, expect } from '@playwright/test';
import { E2EUtils, E2E_EXAMPLE_VIS_CODE } from './E2E_utils';

test('Can use own data or data from python model in visualisations', async ({ page }) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
  await e2e.addChart()

  let node0 = e2e.nodeSelector(0)
  await node0.click();
  await page.getByRole('button', { name: 'Add Child' }).click();

  // We first check if we can use the example code, which uses its own data
  let node1 = e2e.nodeSelector(1)
  await node1.click();
  await e2e.setVisualEditorText(E2E_EXAMPLE_VIS_CODE)
  await page.getByRole('button', { name: 'Embed Visualisation' }).click();
  
  let node1Contents = e2e.nodeContentsSelector(1)
  await expect(node1Contents).toBeVisible(); // Only visible if it has contents

  // Update parent with proper data
  await node0.click();
  const pythonEditorText = 'def main():\n    my_dict = {\n        "values": [\n            {"x": 1, "y": 2},\n            {"x": 2, "y": 3}\n        ]\n    }\n    return my_dict'
  await e2e.setPythonEditorText(pythonEditorText)
  await e2e.runPython()

  // Clear node, and re-embed, then check if visible
  await e2e.clearNode(0)
  await e2e.setNodeVisualEditorText(0, E2E_EXAMPLE_VIS_CODE)
  await node0.click()
  await e2e.embedVisualisation();

  let node0Contents = e2e.nodeContentsSelector(0)
  await expect(node0Contents).toBeVisible();
}, {timeout : 70000});

test('Can use parent data in visualisations', async ({ page}) => {
  let e2e = new E2EUtils(page)
  await page.goto('http://localhost:5173/');
  await e2e.addChart()
  await e2e.clickNode(0)
  const parentPythonCode = `def main(parent):
my_dict = {
"values": [
{"x": 4, "y": 4},
{"x": 2, "y": 2}
]
}
return my_dict`
  await e2e.setPythonEditorText(parentPythonCode)

  await e2e.addChildChart(0)
  await e2e.dragByOffset(0, 0, 200)
  await e2e.dragByOffset(1, 0, -200)
  await e2e.clickNode(0)
  await e2e.runPython()

  
  const childPythonCode = `def main(parent):
return parent
  `
  await e2e.setNodePythonEditorText(1, childPythonCode)
  await e2e.setNodeVisualEditorText(1, `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
"description": "A simple scatter plot with a small local dataset.",
"data": {},
"mark": "point",
"encoding": {
  "x": { "field": "x", "type": "quantitative" },
"y": { "field": "y", "type": "quantitative" }
}
`)

  await e2e.runNodePython(1)

  let node1Contents = e2e.nodeContentsSelector(1)
  await expect(node1Contents).not.toBeVisible()
  await e2e.embedNodeVisualisation(1)
  await expect(node1Contents).toBeVisible();
})

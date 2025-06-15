import { Page, Locator, expect } from '@playwright/test';

export const E2E_EXAMPLE_VIS_CODE = `
{
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
}
`

export class E2EUtils {
    page : Page;
    constructor(page : Page) {
        this.page = page;
    }

nodeSelector(id : number) : Locator {
    let nodes = this.page.locator(`[data-id="${id}"]`)
    return nodes.first()
}

nodeContentsSelector(id : number) : Locator {
    let nodeContents = this.page.locator(`#nodecontents-${id}`)
    return nodeContents
}

clickNode(id : number) {
    let node = this.nodeSelector(id)
    node.evaluate((node) => {
        if (node instanceof HTMLElement) {
            node.style.zIndex = '1001'
        }
    })
    return node.click()
}

terminalSelector() : Locator {
    return this.page.locator('py-terminal')
}

async terminalContainsText(text: string) {
    await expect(this.terminalSelector()).toContainText(RegExp(`\.*?${text}.*?`));
}

async toggleTerminal() {
    this.page.getByLabel('toggle python terminal').click();
}

async runPython() {
    await this.page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
    await this.page.getByRole('button', { name: 'Run Python' }).click();
}

async embedVisualisation() {
    await this.page.waitForFunction(() => window.pythonHandlerReady === true, { timeout: 30000 })
    await this.page.getByRole('button', { name: 'Embed Visualisation' }).click();
}

async hideEditors() {
    await this.togglePythonEditorVisibility()
    await this.toggleVisualEditorVisibility()
}

async togglePythonEditorVisibility() {
    await this.page.getByLabel('toggle python editor').click();

}

async toggleVisualEditorVisibility() {
    await this.page.getByLabel('toggle visual editor').first().click();

}  

async addChart() {
    await this.page.getByLabel('add chart').click();
}

async addChildChart(id : number) {
    await this.clickNode(id)
    await this.page.getByRole('button', { name: 'Add Child' }).click();
}

getVisualEditorTextLocator() : Locator {
    return this.page.locator('#visual-editor-wrapper').getByLabel('Editor content')
}


getPythonEditorTextLocator() : Locator {
  return this.page.locator('#python-editor-wrapper').getByLabel('Editor content')
}

/**
 * Generally works better for doing text-contains than the standard Python Editor Locator
 * @returns Locator for the Python Editor
 */
getSimplePythonEditorTextLocator() : Locator {
  return this.page.locator('#python-editor-wrapper')
}

/**
 * Generally works better for doing text-contains than the standard Visual Editor Locator
 * @returns Locator for the Visual Editor
 */
getSimpleVisualEditorTextLocator() : Locator {
    return this.page.locator('#visual-editor-wrapper')
}


async clearNode(id : number) {
    let node = this.nodeSelector(0)
    await node.click()
    await this.page.getByRole('button', { name: 'Clear Contents' }).click();
}

async setPythonEditorText(text : string) {
    let pythonEditor = this.getPythonEditorTextLocator()
    await pythonEditor.press('ControlOrMeta+a');
    await pythonEditor.press('Backspace')
    await pythonEditor.fill(text);
}

async setNodePythonEditorText(id : number, text : string) {
    await this.clickNode(id)
    await this.setPythonEditorText(text)
}

async setNodeVisualEditorText(id : number, text : string) {
    await this.clickNode(id)
    await this.setVisualEditorText(text)
}

async runNodePython(id : number) {
    await this.clickNode(id)
    await this.runPython()
}

async embedNodeVisualisation(id : number) {
    await this.clickNode(id)
    await this.embedVisualisation()
}

async setVisualEditorText(text : string) {
    let visualEditor = this.getVisualEditorTextLocator()
    await visualEditor.press('ControlOrMeta+a');
    await visualEditor.press('Backspace')
    await visualEditor.fill(text);
}

async dragByOffset(node : number, offsetX : number, offsetY : number) {
    const source = this.nodeSelector(node)
    const sourceBox = await source.boundingBox();
  
    if (sourceBox) {
      // Move mouse to source element center
      await this.page.mouse.move(
        sourceBox.x + sourceBox.width / 2,
        sourceBox.y + sourceBox.height / 2
      );
      await this.page.mouse.down();
  
      // Move mouse by offsets
      await this.page.mouse.move(
        sourceBox.x + sourceBox.width / 2 + offsetX,
        sourceBox.y + sourceBox.height / 2 + offsetY
      );
      await this.page.mouse.up();
    }
  }
  
}
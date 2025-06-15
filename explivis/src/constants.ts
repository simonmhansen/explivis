export const NODE_ID_STRING : string = "nodecontents-"
export const NOPARENT_STRING : string = "NOPARENT"
export const SAVEFILE_NAME : string = "saveData"
export const NODE_DROPDOWN_ID : string = "Node"
export const PYTHON_PARENT_DATA_DOES_NOT_EXIST : string = "PYTHON_PARENT_DATA_DOES_NOT_EXIST"

const visualModelDefaultPath = '/static/templates/visualModelDefault.json'
const pythonModelDefaultPath = '/static/templates/pythonModelDefault.py'
export const VISUAL_TEMPLATE_PATH = 'templates/visual/'
export const PYTHON_TEMPLATE_PATH = 'templates/python/'

export let VISUAL_MODEL_START_CODE : string = ""
export let PYTHON_MODEL_START_CODE : string = ""

async function initialiseVisualModelStartCode() {
  try {
    const response = await fetch(visualModelDefaultPath)
      if (!response.ok) {
        throw new Error(`Failed to fetch visual model default code. Is ${visualModelDefaultPath} correct?`)
      }
      VISUAL_MODEL_START_CODE = await response.text();
    
    } catch (error) {
      console.error(error)
    VISUAL_MODEL_START_CODE = ""
  }
}

async function initialisePythonModelStartCode() {
  try {
    const response = await fetch(pythonModelDefaultPath)
      if (!response.ok) {
        throw new Error(`Failed to fetch visual model default code. Is ${pythonModelDefaultPath} correct?`)
      }
      PYTHON_MODEL_START_CODE = await response.text();
    
    } catch (error) {
      console.error(error)
    PYTHON_MODEL_START_CODE = ""
  }
}

initialiseVisualModelStartCode()
initialisePythonModelStartCode()
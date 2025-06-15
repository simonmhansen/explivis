import { NOPARENT_STRING, PYTHON_PARENT_DATA_DOES_NOT_EXIST } from '../constants';
import type { PythonHandler } from '../Interfaces/PythonHandler';
import { chartHandler, monacoHandler, notyf, pythonHandlerReady } from '../stores';
import { get } from 'svelte/store';
import { PythonResult } from '../Interfaces/PythonResult';
import type { PythonResultType } from '../Interfaces/PythonResult';
  
export class PyScriptPythonHandler implements PythonHandler {
    private pythonReadyToasted = false;
    private interpreter = null;
    private setupCode = `
__dataHandler = {}
__datasets = {}

__dataHandler["${NOPARENT_STRING}"] = {
      "values": [
        { "x": 1, "y": 1 },
        { "x": 2, "y": 2 },
        { "x": 3, "y": 3 }
      ]
    }
`

    async runPythonWithoutReturn(program: string): Promise<PythonResultType> {
        try {
            if (!get(pythonHandlerReady)) {
                return {type: PythonResult.Warning, message: "Python is not ready"}
            }
            this.interpreter.runPython(program)

        } catch (error) {
            console.error(error)
            return {type: PythonResult.Error}
        }
        
        return {type: PythonResult.Success}
    }

    /**
     * Runs Python in a PythonMain program, invisible to the viewer. It sets
     * the output in the dataHandler, so it can be retrieved later on.
     * This expects a main function to run, which returns a value we store.
    * @param id id of the node, so the output value can be stored 
    * @param program program to run
     */
    async runPython(id: string, program: string) : Promise<PythonResultType> {
        try {
            
            if (get(pythonHandlerReady)) {
                let parentId = chartHandler.getParentId(id)
                let utilityLibrary = monacoHandler.getUtilityLibrary().getValue()
                let main = `
${utilityLibrary}

${program}

def __internal_main():
    try:
        __parent = __dataHandler["${parentId}"]
    except Exception as e:
        print(e)
        return "${PYTHON_PARENT_DATA_DOES_NOT_EXIST}"
    
    __dataHandler["${id}"] = main(__parent)

    return True
__internal_main()
`               
                let res = this.interpreter.runPython(main)
                if (res === PYTHON_PARENT_DATA_DOES_NOT_EXIST) {
                    console.error("No data exists for parent in Python code. Ensure that parent's main function has a return value.")
                    return {
                        type: PythonResult.Warning,
                        message: "Failed to execute Python: Missing parent data"
                    }
                }
            } else {
                return {type: PythonResult.Warning, message: "Python is not ready"}
            }

        } catch (error) {
            console.error(error)
            return {type: PythonResult.Error}
        }
        return {type: PythonResult.Success}
    }

    setInterpreter(newIntrepreter : any): void {
        this.interpreter = newIntrepreter;
        try {
            this.interpreter.runPython(this.setupCode)
            pythonHandlerReady.set(true);
            window.pythonHandlerReady = true;
            if (!this.pythonReadyToasted) {
                notyf.success("Python Environment Ready")
                this.pythonReadyToasted = true
            }
            
        } catch (error) {
            console.error("Failed to set up pyscript interpreter, trying again")
            setTimeout(() => this.setInterpreter(newIntrepreter), 1000)
        }
        
    }

    /**
     * Gets the dataHandler from Python which stores Python results
     * @returns dataHandler in Python which stores values
     */
    getDataHandler() {
        try {
            if (get(pythonHandlerReady)) {
                return this.interpreter.globals.get('__dataHandler')
            }            
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Adds a dataset to the __dataset map
     * @dataset the dataset loaded as string
     * @name name of the dataset
     */
    addDataset(dataset: string, name: string): void {
        try {
            if (get(pythonHandlerReady)) {
                let program = `
import json
__datasets["${name}"] = json.loads('''${dataset}''')
`
                this.runPythonWithoutReturn(program)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

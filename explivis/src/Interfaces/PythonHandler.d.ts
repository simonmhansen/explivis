import type { PythonResultType } from "./PythonResult";

export interface PythonHandler {
    /**
     * Runs Python code which does not return something, but which should be stored.
     * @param program program to run
     */
    async runPythonWithoutReturn(program: string) : Promise<PythonResultType>;

    /**
     * Runs Python which returns a value we store for the visual model.
    * @param id id of the node, so the output value can be stored 
    * @param program program to run
     */
    async runPython(id: string, program: string) : Promise<PythonResultType>;

    setInterpreter(newIntrepreter: any) : void;

    /**
     * Gets the dataHandler from Python which stores Python results
     * @returns dataHandler in Python which stores values
     */
    getDataHandler() : any;


    /**
     * Adds a dataset to the __dataset map
     * @dataset the dataset loaded as string
     * @name name of the dataset
     */
    addDataset(dataset: string, name: string) : void;
}

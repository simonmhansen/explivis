import type { DatasetHandler } from "../Interfaces/DatasetHandler";
import { notyf, pythonHandler, pythonHandlerReady } from "../stores";

const DATASET_MANIFEST_PATH = "datasets/manifest.json"

export class FileDatasetHandler implements DatasetHandler {

    constructor() {
        this.loadDatasets();
    }

    async uploadDataset(file: File): Promise<void> {
        try {
            // Await that the PythonHandler is ready for the dataset
            await new Promise((resolve) => {
                const unsubscribe = pythonHandlerReady.subscribe((value) => {
                    if (value === true) {
                        resolve(); // Resolve when the condition is met
                        unsubscribe(); // Clean up subscription
                    }
                })
            })

            const reader = new FileReader()
            reader.onload = (event) => {
                try {
                    const datasetString = event.target?.result as string;
                    pythonHandler.addDataset(datasetString, file.name)
                }
                catch (error) {
                    console.error("Failed to parse uploaded dataset")
                }
            }

            reader.onerror = () => { throw new Error("Failed to parse uploaded dataset") }
            reader.readAsText(file)

            notyf.success("Successfully uploaded dataset")
        } catch (error) {
            console.error(error)
            notyf.error("Failed to upload dataset")
        }

    }
 
    async loadDatasets(): Promise<any> {

        try {
            const manifestRes = await fetch(`${DATASET_MANIFEST_PATH}`)
            if (!manifestRes.ok) throw new Error('Failed to load dataset file manifest')
            const fileNames: string[] = await manifestRes.json()    

            // Await that the PythonHandler is ready for the dataset
            await new Promise((resolve) => {
                const unsubscribe = pythonHandlerReady.subscribe((value) => {
                    if (value === true) {
                        resolve(); // Resolve when the condition is mest
                        unsubscribe(); // Clean up subscription
                    }
                })
            })

            // Fetch all datasets listed in the manifest
            fileNames.map(async (fileName) => {
                const fileRes = await fetch(`datasets/${fileName}`)
                if (!fileRes.ok) throw new Error(`Failed to fetch template ${fileName}`)
                const content = await fileRes.text();
                
                pythonHandler.addDataset(content, fileName)                
            })
                
        } catch (error) {
            
        }
        
        return
    }
}
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { MonacoHandler } from "../Interfaces/MonacoHandler";
import { nodeCreatedObserver } from "../stores";
import { PYTHON_MODEL_START_CODE, PYTHON_TEMPLATE_PATH, VISUAL_MODEL_START_CODE, VISUAL_TEMPLATE_PATH } from '../constants';
import { writable, type Writable } from 'svelte/store';
let monaco = (await import('../../monaco-config')).default;

export class StandardMonacoHandler implements MonacoHandler {
    pythonModelMap: Map<string, Monaco.editor.ITextModel>;
    pythonEditor: Monaco.editor.IStandaloneCodeEditor | null = null;
    visualModelMap: Map<string, Monaco.editor.ITextModel>
    visualEditor: Monaco.editor.IStandaloneCodeEditor | null = null;
    modelToNodeMap: Map<Monaco.editor.ITextModel, string>;
    pythonTemplateMap: Map<string, Monaco.editor.ITextModel>;
    visualTemplateMap: Map<string, Monaco.editor.ITextModel>;
    utilityLibraryModel : Monaco.editor.ITextModel;

    pythonTemplateNames = writable<string[]>([]);
    visualTemplateNames = writable<string[]>([]);
    
    constructor() {
        this.pythonModelMap = new Map();
        this.visualModelMap = new Map();
        this.modelToNodeMap = new Map();
        this.pythonTemplateMap = new Map(); 
        this.visualTemplateMap = new Map(); 

        this.utilityLibraryModel = monaco.editor.createModel("", "python")

        nodeCreatedObserver.subscribe((nodeCreatedEvent) => {
            if (nodeCreatedEvent === undefined) {return; }

            try {
                this.createMonacoModelsForNode(nodeCreatedEvent.detail.nodeObject.id)    
            } catch (error) {
                console.error("Failed to create Monaco Models for new node")
            }
        })


        // Set up Templates
        this.setupTemplates();

    }
    /**
     * Fetches the contents of templates in public/templates/{python, visual}
     * and creates templates for them
     */
    private async setupTemplates() {
        await this.setupTemplatesOfType(PYTHON_TEMPLATE_PATH, "python", this.pythonTemplateMap, this.pythonTemplateNames);
        await this.setupTemplatesOfType(VISUAL_TEMPLATE_PATH, "json", this.visualTemplateMap, this.visualTemplateNames);
    }

    /**
     * Fetches all files from a given manifest-file path, and
     * creates monaco models for them in the given template map
     * @param path path to folder for template type
     * @param templateType "python" or "json" (for visual model)
     * @param templateMap the corresponding map for the template type
     */
    private async setupTemplatesOfType(path: string, templateType: string, templateMap: Map<string, Monaco.editor.ITextModel>, templateStore: Writable<string[]>) {
        try {
            const manifestRes = await fetch(`${path}manifest.json`)
            if (!manifestRes.ok) throw new Error('Failed to load template file manifest')
            const fileNames: string[] = await manifestRes.json();

            // Fetch all files listed in the manifest
            const fileFetches = fileNames.map(async (fileName) => {
                const fileRes = await fetch(`${path}${fileName}`);
                if (!fileRes.ok) throw new Error(`Failed to fetch template ${fileName}`);
                const content = await fileRes.text();

                // Create Monaco Model
                let templateModel = monaco.editor.createModel(content, templateType)
                templateMap.set(fileName, templateModel)
            })

            // Update store for others to see
            templateStore.set(fileNames)

            // Wait for all templates
            await Promise.all(fileFetches)

            
        } catch (error) {
            console.error("Error loading templates: ", error)
        }
    }



    createMonacoModelsForNode(id: string) {
        let newPythonModel = monaco.editor.createModel(PYTHON_MODEL_START_CODE, "python")
        let newVisualModel = monaco.editor.createModel(VISUAL_MODEL_START_CODE, "json")
        this.pythonModelMap.set(id, newPythonModel)
        this.visualModelMap.set(id, newVisualModel)
        this.modelToNodeMap.set(newPythonModel, id)
        this.modelToNodeMap.set(newVisualModel, id)
    }

    getPythonModel(id: string) {
        return this.pythonModelMap.get(id)
    }

    getVisualModel(id: string) {
        return this.visualModelMap.get(id)
    }

    getNodeIdFromModel(model: Monaco.editor.ITextModel): undefined | string {
        return this.modelToNodeMap.get(model);
    }

    setPythonEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
        this.pythonEditor = editor;
    }

    setVisualEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
        this.visualEditor = editor;
    }

    getPythonTemplates() {
        return this.pythonTemplateNames
    }

    getVisualTemplates() {
        return this.visualTemplateNames
    }

    getPythonTemplateModel(id: string) {
        return this.pythonTemplateMap.get(id)
    }

    getVisualTemplateModel(id: string) {
        return this.visualTemplateMap.get(id)
    }

    getUtilityLibrary() : Monaco.editor.ITextModel {
        return this.utilityLibraryModel
    }

    appendToUtilityLibrary(code: string): void {
        let currentCode = this.utilityLibraryModel.getValue()
        let delimiterCode = '\n####### Appended from Save File #######\n'
        let newCode = currentCode + delimiterCode + code
        this.utilityLibraryModel.setValue(newCode)
    }
}
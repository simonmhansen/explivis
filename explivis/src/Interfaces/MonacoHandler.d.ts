import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { type Writable } from 'svelte/store'

export interface MonacoHandler {
    /**
     * Returns the Chart's Python model
     * @param id id of a Chart
     */
    getPythonModel(id: string) : ITextModel

    /**
     * Returns the Chart's visual model
     * @param id id of a Chart
     */
    getVisualModel(id: string) : ITextModel

    setPythonEditor(editor : Monaco.editor.IStandaloneCodeEditor) : void
    setVisualEditor(editor : Monaco.editor.IStandaloneCodeEditor) : void

    /**
     * Returns the id of the Chart who owns the given model
     * @param model a monaco text model
     */
    getNodeIdFromModel(model: ITextModel) : undefined | string

    getPythonTemplates() : Writable<string[]>
    getVisualTemplates() : Writable<string[]>
    
    getPythonTemplateModel(id: string) : Monaco.editor.ITextModel
    getVisualTemplateModel(id: string) : Monaco.editor.ITextModel

    getUtilityLibrary() : Monaco.editor.ITextModel

    /**
     * Appends the supplied Python code the the Monaco model of the Utility Library
     * @param code Python code
     */
    appendToUtilityLibrary(code : string) : void
}
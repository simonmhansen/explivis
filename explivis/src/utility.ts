import type monaco from "../monaco-config";
import type { PythonResultType } from "./Interfaces/PythonResult";
import { PythonResult } from "./Interfaces/PythonResult";

export function isString(value: string | undefined) : value is string {
    return typeof value === "string";
}

export function isITextModel(value: monaco.editor.ITextModel | null) : value is monaco.editor.ITextModel {
    return (
        typeof value === "object" &&
        value !== null &&
        "getValue" in value &&
        typeof (value as monaco.editor.ITextModel).getValue === "function"
    )
}

export class SubtreeError extends Error {
    public readonly pythonResult: PythonResultType;
  
    constructor(message: string, pythonResult: PythonResultType) {
      super(message)
      this.pythonResult = pythonResult
    }
  
  }
  
export let standardSubtreeError = new SubtreeError("Failed to execute nodes", {type: PythonResult.Error, message: "Failed to execute nodes"})

export function isSubtreeError(error: unknown): error is SubtreeError {
    return error instanceof SubtreeError
}
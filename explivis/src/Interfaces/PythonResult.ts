export enum PythonResult {
    Success,
    Warning,
    Error
}

export type PythonResultType = {
    type: PythonResult,
    message?: string
}
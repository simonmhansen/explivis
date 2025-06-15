// Imports hooks from PyScript to inform the rest of the framework of when PyScript is initialised
import { hooks } from "../../pyscript/core.js";
import { setPythonInterpreter, notyf } from "../stores.ts";


// The `hooks.main` attribute defines plugins that run on the main thread.
hooks.main.onReady.add((wrap, element) => {

    // Signal to the PythonHandler that we should try to set up the interpreter
    const pyscriptIsReadyEvent = new CustomEvent("pyScriptIsReady")
    window.dispatchEvent(pyscriptIsReadyEvent)
    setPythonInterpreter(wrap.interpreter)
});
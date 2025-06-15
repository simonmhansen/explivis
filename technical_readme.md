# Technical Documentation
This is the technical documentation for ExpliVis. ExpliVis is built in Svelte and Node.js. The framework uses the following libraries/frameworks:
* Svelte-Flow
* FlyonUI (Tailwind)
* Monaco Editor
* PyScript (and Pyodide)


## Overview
The file `App.svelte` works as the main file for ExpliVis and loads in all SFCs.

The follwing is a list of the folders in `/src/`:
* ExpliVis is built with Compositional Design in mind. The main interfaces can be found in `/src/Interfaces`. 
* The implementations can be found in `/src/Strategies/`. The file `stores.ts` sets which implementations are used, and initialises core data structures. 
* `/src/Components` holds the SFCs for the buttons in the framework. 
* `/src/Nodes` is ExpliVis' own implementation of a Svelte-Flow node. This is the core logical unit for Charts. 

The following is a list of the folders in the root ExpliVis folder `/`:
* `/e2e/` holds a list of end-to-end tests. See below for more information. 
* `/pyscript/` holds the PyScript library.
* `/public/` has templates and example datasets for users. See below for more information. 
* `/static/` holds the template for the standard code in the Python and Vega-Lite Monaco editors. 
* `/test/` holds a list of unit tests. See below for more information.

## PyScript
PyScript creates a Python environment in the web browser. It has special behaviour, which merits special attention. 

The PyScript interpreter takes some time to load, which it does in a separate web worker. This means the user is free to use the web framework while PyScript loads - but if they try to execute Python code, it will not work. 

PyScript has lifecycle hooks, which informs when it is initialised. The file `/src/Strategies/InitialisePythonHandler.js` listens for these hooks, and when the interpreter is initialised, it dispatches an event to the PythonHandler. After that, the colour of the buttons in the UI change to green, and a toast is created to inform the user that the interpreter is ready. 

PyScript has its own terminal, which is created in `index.html`. It is also not initialised immediately, and so `App.svelte` listens for it, and makes it `hidden` when the terminal is added to the DOM.

PyScript supports most pure Python wheels and a selection of ther Python libraries. To set which libraries are imported into the Python environment, see `py-config` in `index.html`. The following lists (as of this writing) the available Pyodide/PyScript packes: https://pyodide.org/en/stable/usage/packages-in-pyodide.html. 


## Templates and Datasets
ExpliVis supports adding templates and custom datasets in the web framework folder structure.

The datasets should be in JSON format, and can be added in `/src/public/datasets/`.

Python templates should be in .py format, and can be added in `/src/public/templates/python/`.

Visual templates (Vega-Lite schemas) should be in JSON format, and can be added in `/src/public/templates/visual/`. 

For each of these three folders, remember to update its `manifest.json` file with the new filename.

## Tests
ExpliVis has limited use of Vitest, which can be run with:
```sh
npx vitest test
```
Most of these should fail. They serve as example of how tests could be run with Vitest. ExpliVis, however, prefers testing with Playwright. The end-to-end Playwright tests require that the server runs, so do:
```sh
npm run dev
npx playwright test
```
These should all run. The Playwright tests are located in `/src/e2e/`. ExpliVis makes use of its own wrapper around Playwright, which can be found in `/src/e2e/E2EUtils.ts`.
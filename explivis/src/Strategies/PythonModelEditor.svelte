<script lang="ts">
import { onMount, onDestroy, tick } from 'svelte';
import { pythonEditorVisible, pythonHandler, nodeClickedObserver, monacoHandler, pythonHandlerReady, nodeDraggedObserver, visualModelHandler, chartHandler, notyf } from '../stores';
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { IconPlay, IconFastForward } from 'obra-icons-svelte';
import { isITextModel, isString } from '../utility';
import { NODE_DROPDOWN_ID } from '../constants';
import { PythonResult } from '../Interfaces/PythonResult';
import { SubtreeError, standardSubtreeError } from '../utility';

const PLACEHOLDER_STRING = "PLACEHOLDER"
const UTILITY_LIBRARY_STRING = "Utility Library"



let visible : boolean = true;  // Bindable prop to control visibility
pythonEditorVisible.subscribe(v => {
  visible = v

  const pane = document.querySelector("[data-pane-id='left-pane']");
    if (pane) {
      pane.style.zIndex = $pythonEditorVisible ? '3' : '-3';
    }

})

let monaco: typeof Monaco;
let pythonEditor: Monaco.editor.IStandaloneCodeEditor;
let pythonEditorContainer: HTMLElement;
let pythonCode: string = "";
let activeModel: Monaco.editor.ITextModel | null;
let activeNode: string = PLACEHOLDER_STRING;
let unsubscribeToModel: Monaco.IDisposable | undefined;


let selectedModelId: string = NODE_DROPDOWN_ID;
let dropdownTemplates: string[] = []
monacoHandler.getPythonTemplates().subscribe(templates => {dropdownTemplates = templates})
let nodeOption: string = "Node";


function handleDropdownChange(event : Event) {

  // Selected the Node
  if (activeNode === PLACEHOLDER_STRING) {
    return;
  }

  if (selectedModelId === UTILITY_LIBRARY_STRING) {
    let utilityLibraryModel = monacoHandler.getUtilityLibrary()
    pythonEditor.setModel(utilityLibraryModel)
    selectedModelId = UTILITY_LIBRARY_STRING
    tick()
    return ;
  }

  if (selectedModelId === NODE_DROPDOWN_ID) {
    changeModelToActiveNode();
    return;
  }

  if (dropdownTemplates.includes(selectedModelId)) {
    changeModelToTemplate(selectedModelId);
    return;
  }

}

function changeModelToActiveNode() {
  let selectedNodeModel = monacoHandler.getPythonModel(activeNode)
  pythonEditor.setModel(selectedNodeModel)
  selectedModelId = NODE_DROPDOWN_ID;
  tick()
}

function changeModelToTemplate(templateName: string) {
  let templateModel = monacoHandler.getPythonTemplateModel(templateName)
  pythonEditor.setModel(templateModel)
}


onMount(async() => {
    // Import our 'monaco.ts' file here
    // (onMount() will only be executed in the browser, which is what we want)
    monaco = (await import('../../monaco-config')).default;

    pythonEditor = monaco.editor.create(pythonEditorContainer, {
      value: "Please create a node, then select it to start editing code",
      language: "python",
      theme: "vs-light",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {enabled: false},
    });
    selectedModelId =  nodeOption

    activeModel = pythonEditor?.getModel();

    try {
      pythonCode = activeModel?.getValue();  
    } catch (error) {
      pythonCode = ""
    }
    
    // We should unsubscribe from the model, so changes to another model
    // does not mean that we update the value in the currently visible one
    unsubscribeToModel = activeModel?.onDidChangeContent((e) => {
      try {
        pythonCode = activeModel?.getValue();  
      } catch (error) {
        pythonCode = ""
      }
    })

    pythonEditor.onDidChangeModel(() => {
        unsubscribeToModel?.dispose()
        
        activeModel = pythonEditor?.getModel();
        unsubscribeToModel = activeModel?.onDidChangeContent((e) => {
          try {
            pythonCode = activeModel?.getValue();
          } catch (error) {
            pythonCode = ""
          }
        })
    })

    // ###### -Observers START- ######
    nodeClickedObserver.subscribe((nodeClickedEvent) => {
      try {
        let nodeData = nodeClickedEvent.detail.node;
        if (nodeData.selected === true) {
          activeNode = nodeData.id;
          changeModelToActiveNode();
        }        
      } catch (error) {
        console.error("Failed to set new Python Model on node click")
      }
    });

    nodeDraggedObserver.subscribe((nodeDraggedEvent) => {
      try {
        let nodeData = nodeDraggedEvent.detail.targetNode
        if (nodeData.selected === true) {
          activeNode = nodeData.id;
          changeModelToActiveNode();
        }
      } catch (error) {
        console.error("Failed to set new Python Model on node drag")
      }
    })

    // ######  -Observers END-  ######
});

onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    pythonEditor?.dispose();
});
  
let executePythonCode = () => {
  try {
    if (!isITextModel(activeModel)) {
      console.error("Failed to execute Python for node. Is the Python code connected to a node?")
      notyf.error("Failed to execute Python")
      return ;
    }

    let id = monacoHandler.getNodeIdFromModel(activeModel)
    if (!isString(id)) {
      console.error("Failed to execute Python for node. Does node still exist?")
      notyf.error("Failed to execute Python")
      return ;
    }

    let execute = pythonHandler.runPython.bind(pythonHandler)
    let res = execute(id, activeModel.getValue());  
    res.then(success => {
      if (success.type === PythonResult.Success) {
        notyf.success("Executed Python")
      } else if (success.type === PythonResult.Warning) {
        notyf.open({type: "warning", message: success.message ? success.message : "Failed to execute Python"})
      } else {
        notyf.error("Failed to execute Python")
      }
    })
    
  } catch (error) {
    console.error("Failed to execute Python Code")
    notyf.error("Failed to execute Python")
  }

}

/**
 * Executes the Python and Visualisation Code for this node and all its children (so its entire sub-tree)
 */
async function executeSubtree() {
  async function executeSingleNodeRecursively(id: string) {

    // Execute Python
    let pythonModel = monacoHandler.getPythonModel(id)
    if (!isITextModel(pythonModel)) {
      console.error("Failed to execute node. Does the node have a python model?")
      throw standardSubtreeError
    }

    pythonCode = pythonModel.getValue()
    let execute = pythonHandler.runPython.bind(pythonHandler)
    let res = await execute(id, pythonCode);  
    if (res.type != PythonResult.Success) {
      throw new SubtreeError("Failed to execute Python code", res)
    }

    // Execute Visual Model
    let visualModel = monacoHandler.getVisualModel(id)
    if (!isITextModel(visualModel)) {
      console.error("Failed to embed visualisation in node. Does the node have a visual model?")
      throw new SubtreeError("Failed to find visual model", {type: PythonResult.Error, message: "Failed to find visual model"})
    }

    let visualCode = visualModel.getValue()
    let visRes = await visualModelHandler.embedVisualisation(id, visualCode)
    if (!visRes) {
      throw new SubtreeError("Failed to execute Visualisation code", {type: PythonResult.Error, message: "Failed to execute Visualisation code"})
    }
    await tick()

    // Find children and execute them recursively
    let children = chartHandler.getChildrenIds(id)
    if (!children || !Array.isArray(children) || children.length === 0) {
      return ;
    }
    await Promise.all(children.map(childId => executeSingleNodeRecursively(childId)))

  }

  try {
    let id = monacoHandler.getNodeIdFromModel(activeModel)
    if (!isString(id)) {
      console.error(`Failed to execute node for non-string id: ${id}. Does node still exist?`)
      notyf.error("Failed to execute first node")
      return false;
    }

    await executeSingleNodeRecursively(id)
    notyf.success("Execution successful")

  } catch (error) {
    if (error instanceof SubtreeError) {
      console.error(error)
      if (error.pythonResult.type === PythonResult.Warning) {
        notyf.open({type: "warning", message: error.pythonResult.message ? error.pythonResult.message : "Failed to execute nodes"})
      }
      else {
        notyf.error(error.pythonResult.message ? error.pythonResult.message : "Failed to execute nodes")
      }

    } else {
      console.error("Failed to execute python and visualisation code in subtree. Does all nodes exist?")
      console.error(error)
      notyf.error("Failed to execute nodes")
    }
  }

}

let overwriteNodeWithTemplate = () => {
  try {
    // Active Model is set automatically by observer down below
    if (isITextModel(activeModel)) {
      let templateValue = activeModel.getValue();
      let nodeModel = monacoHandler.getPythonModel(activeNode)

      nodeModel.setValue(templateValue)

      changeModelToActiveNode();
    }
  } catch (error) {
    console.error("Failed to overwrite node Python code with template")
  }
}

</script>



<div bind:this={pythonEditorContainer} class="monaco_editor {visible ? '' : 'hidden'} monaco-wrapper" id="python-editor-wrapper">
    <div class="monaco-title-box">
      <!-- Left (just to align the other items) -->
      <div class="monaco-title-box-left"></div>
     
      <!-- Middle -->
      <div class="monaco-title-box-middle">
        <h2>Python Editor</h2>

        <!-- Dropdown -->
        <select
          bind:value={selectedModelId}
          on:change={handleDropdownChange}
          class="btn btn-outline bg-[#FAFAFA] btn-xs no-animation"
        >
          {#if activeNode !== PLACEHOLDER_STRING}
            <option value={nodeOption}>{nodeOption}</option>  
          {/if}
          <option value={UTILITY_LIBRARY_STRING}>{UTILITY_LIBRARY_STRING}</option>
          {#each dropdownTemplates as template}
            <option value={template}>Template: {template}</option>
          {/each}
        </select>
      </div>

      <!-- Right -->
      <div>

        {#if selectedModelId === NODE_DROPDOWN_ID || activeNode === PLACEHOLDER_STRING}      
        <!-- Run All Button -->
          <button 
            title="Runs the Python and Visualisation code for this node and all its children"
            class="monaco-title-box-right btn m-1 pl-2.5 pr-2 btn-sm btn-soft {$pythonHandlerReady ? 'btn-success' : 'btn-warning'}"
            on:click={(e) => executeSubtree()}
            >
            
            <IconFastForward />
          </button>


        <!-- Run Python Button -->
          <button class="python-button monaco-title-box-right btn m-1 pl-2 pr-2 btn-sm {$pythonHandlerReady ? 'btn-success' : 'btn-warning'}" on:click={(e) => executePythonCode()}>
            <IconPlay /> Run Python
          </button>
        
        
        <!-- Utility Library has no buttons -->
        {:else if selectedModelId === UTILITY_LIBRARY_STRING}
          <!-- Disabled Buttons -->
          <button 
          title="Runs the Python and Visualisation code for this node and all its children"
          class="monaco-title-box-right btn m-1 pl-2.5 pr-2 btn-sm btn-soft btn-disabled"
          >
            <IconFastForward />
          </button>
          <button class="python-button monaco-title-box-right btn m-1 pl-2 pr-2 btn-sm btn-soft btn-disabled">
            <IconPlay /> Run Python
          </button>
        

        <!-- Insert Template Button -->
        {:else}
          <button class="python-button monaco-title-box-right btn m-1 pl-2 pr-2 btn-sm btn-info transition-none" on:click={(e) => overwriteNodeWithTemplate()}>
            <IconPlay /> Overwrite Node
          </button>
        {/if}

      </div>
       
      
    </div>
 
  </div>

  
<style>
  .monaco-title-box-middle {
    display: flex;
    align-items: center;
  }

  .monaco_editor {
    height: 100vh;
    z-index: 3;
  }

  option {
    margin-right: 0;
  }

  .monaco-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.10);
    box-shadow: 5px 10px 18px rgba(0,0,0, 0.1);
    background-color: white;
    z-index: 10;
    align-items: center;
    top: 0;
    left: 0;
    height: calc(99.9%);
    overflow: hidden;
  }

  .monaco-title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :global(.hidden) {
    opacity: 0;
    pointer-events: none;
  }

  h2 {
    margin-top: 0px;
    margin-bottom: 4px;
    margin-left: 0px;
    margin-right: 20px;
  }

  select {
    width: 80px;
  }


  .python-button {
    min-width: 160px;
  }
</style>
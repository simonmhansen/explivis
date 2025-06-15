<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { visualEditorVisible, nodeClickedObserver, visualModelHandler, monacoHandler, pythonHandlerReady, nodeDraggedObserver, notyf } from '../stores';
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { IconPlay } from 'obra-icons-svelte';
import { isITextModel, isString } from '../utility';
import { NODE_DROPDOWN_ID } from '../constants';

const PLACEHOLDER_STRING = "PLACEHOLDER"


let visible: boolean = true; // Bindable prop to control visibility
visualEditorVisible.subscribe(v => {
  visible = v
  
  const pane = document.querySelector("[data-pane-id='right-pane']");
    if (pane) {
      pane.style.zIndex = $visualEditorVisible ? '3' : '-3';
    }

})

let monaco: typeof Monaco;
let visualEditor: Monaco.editor.IStandaloneCodeEditor;
let visualEditorContainer: HTMLElement;
let visualisationCode: string = "";
let activeModel: Monaco.editor.ITextModel | null;
let activeNode: string = PLACEHOLDER_STRING;
let unsubscribeToModel: Monaco.IDisposable | undefined;


let selectedModelId: string = "Node";
let dropdownTemplates: string[] = []
monacoHandler.getVisualTemplates().subscribe(templates => {dropdownTemplates = templates})
let nodeOption: string = "Node";

function handleDropdownChange(event : Event) {

  // Selected the Node
  if (activeNode === PLACEHOLDER_STRING) {
    return;
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
  let selectedNodeModel = monacoHandler.getVisualModel(activeNode)
  visualEditor.setModel(selectedNodeModel)
  selectedModelId = NODE_DROPDOWN_ID;
}

function changeModelToTemplate(templateName: string) {
  let templateModel = monacoHandler.getVisualTemplateModel(templateName)
  visualEditor.setModel(templateModel)
}



onMount(async() => {
  // Import our 'monaco.ts' file here
  // (onMount() will only be executed in the browser, which is what we want)
  monaco = (await import('../../monaco-config')).default;

  visualEditor = monaco.editor.create(visualEditorContainer, {
    value: "",
    language: "json",
    theme: "vs-light",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {enabled: false},
  });
  selectedModelId = nodeOption


  activeModel = visualEditor?.getModel();

  try {
    visualisationCode = activeModel?.getValue();  
  } catch (error) {
    visualisationCode = ""
  }

  // We should unsubscribe from the model, so changes to another model
  // does not mean that we update the value in the currently visible one
  unsubscribeToModel = activeModel?.onDidChangeContent((e) => {
    try {
      visualisationCode = activeModel?.getValue();  
    } catch (error) {
      visualisationCode = ""
    }
  })

  visualEditor.onDidChangeModel(() => {
      unsubscribeToModel?.dispose()
      
      activeModel = visualEditor?.getModel();
      unsubscribeToModel = activeModel?.onDidChangeContent((e) => {
        try {
          visualisationCode = activeModel?.getValue();
        } catch (error) {
          visualisationCode = ""
        }
      })
  })

  // ###### -Observers START- ######
  nodeClickedObserver.subscribe((nodeClickedEvent) => {
    try {
      let nodeData = nodeClickedEvent.detail.node;
      if (nodeData.selected === true) {
        activeNode = nodeData.id;
        changeModelToActiveNode()
      }        
    } catch (error) {
      console.error("Failed to set new Visual Model")
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
  visualEditor?.dispose();
});



function embedVisualisationInNode (id : undefined | string) {
  try {

    if (!isString(id)) {
      console.error(`Failed to embed visualisation in node for non-string id: ${id}. Does node still exist?`)
      notyf.error("Failed to embed visualisation")
      return ;
    }

    let nodeModel = monacoHandler.getVisualModel(id)

    if (!isITextModel(nodeModel)) {
      console.error("Failed to embed visualisation in node. Does the node have a visual model?")
      notyf.error("Failed to embed visualisation")
      return ;
    }

    let res = visualModelHandler.embedVisualisation(id, nodeModel.getValue())
    res.then(success => {
      if (success) {
        notyf.success("Embedded visualisation")
      }
      else {
        notyf.error("Failed to embed visualisation")
      }
    })
    
  } catch (error) {
    console.error(`An error occured while trying to embed visualisation in node with id ${id}`)
    notyf.error("Failed to embed visualisation")
  }  
}

let overwriteNodeWithTemplate = () => {
  try {
    // Active Model is set automatically by observer down below
    if (isITextModel(activeModel)) {
      let templateValue = activeModel.getValue();
      let nodeModel = monacoHandler.getVisualModel(activeNode)

      nodeModel.setValue(templateValue)

      changeModelToActiveNode();
    }
  } catch (error) {
    console.error("Failed to overwrite node Python code with template")
  }
}

</script>

<div bind:this={visualEditorContainer} class="monaco_editor {visible ? '' : 'hidden'} monaco-wrapper" id="visual-editor-wrapper">
  <div class="monaco-title-box justify-between items-center">
    <!-- Left (just to align the other items) -->
    <div class="monaco-title-box-left"></div>


    <!-- Middle -->
    <div class="monaco-title-box-middle">    
      <h2>Visualisation Editor</h2>


      <!-- Dropdown -->
      <select
        bind:value={selectedModelId}
        on:change={handleDropdownChange}
        class="btn btn-outline bg-[#FAFAFA] btn-xs no-animation"
      >
        {#if activeNode !== PLACEHOLDER_STRING}
          <option value={nodeOption}>{nodeOption}</option>  
        {/if}
        {#each dropdownTemplates as template}
          <option value={template}>Template: {template}</option>
        {/each}
      </select>
    </div>

    <!-- Right -->
    <!-- Embed Visualisation Button -->
    {#if selectedModelId === NODE_DROPDOWN_ID || activeNode === PLACEHOLDER_STRING}
    <button class="visual-button btn m-1 pl-2 pr-2 btn-sm {$pythonHandlerReady ? 'btn-success' : 'btn-warning'}" on:click={(e) => embedVisualisationInNode(monacoHandler.getNodeIdFromModel(activeModel))}>
      <IconPlay /> Embed Visualisation
    </button>
   {:else}
   <button class="visual-button monaco-title-box-right btn m-1 pl-2 pr-2 btn-sm btn-info" on:click={(e) => overwriteNodeWithTemplate()}>
    <IconPlay /> Overwrite Node
  </button>
   {/if}
  </div>
</div>

<style>
  .monaco_editor {
    height: 100vh;
    z-index: 3;
  }

  .monaco-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.10);
    box-shadow: 5px 10px 18px rgba(0,0,0, 0.1);
    background-color: white;
    z-index: 10;
    align-items: center;
    top: 0;
    right: 0;
    height: calc(99.9%);
    overflow: hidden;
  }

  .monaco-title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

  .monaco-title-box-middle {
    display: flex;
    align-items: center;
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

  .visual-button {
    min-width: 178px;
  }
</style>

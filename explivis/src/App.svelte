<script lang="ts">
import {
  SvelteFlowProvider,
  SvelteFlow,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/svelte';
import { nodes, edges, nodeClickedObserver, nodeDraggedObserver, notyf } from './stores';
import '@xyflow/svelte/dist/style.css';
import AddChartButton from './Components/Buttons/AddChartButton.svelte';
import ChartNode from './Nodes/ChartNode.svelte';
import VisualModelEditor from './Strategies/VisualModelEditor.svelte';
import HidePythonEditorButton from './Components/Buttons/HidePythonEditorButton.svelte';
import HideVisualEditorButton from './Components/Buttons/HideVisualEditorButton.svelte';
import PythonModelEditor from './Strategies/PythonModelEditor.svelte';
import HidePythonTerminalButton from './Components/Buttons/HidePythonTerminalButton.svelte';
import './app.css'
import SaveSetupButton from './Components/Buttons/SaveSetupButton.svelte';
import LoadSetupButton from './Components/Buttons/LoadSetupButton.svelte';
import  {PaneGroup, Pane, PaneResizer} from "paneforge"
import UploadDatasetButton from './Components/Buttons/UploadDatasetButton.svelte';

let proOptions = {hideAttribution: true}

const nodeTypes = {
  chartNode: ChartNode
}; 

// Functionality to search for PyScript Terminal and apply the hidden class to it
// when it actually spawns.
const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName.toLowerCase() === "py-terminal") {
                    node.classList.add("hidden") // Hide terminal initially
                    observer.disconnect() // Only one instance, so stop checking now
                }
            })
        })
    })

observer.observe(document.body, { childList: true, subtree: true})
notyf.open({type: "warning", message: "Setting up Python Environment"}) 

</script>

<div >  
  <div class="flow-background">
    <SvelteFlowProvider>
      <SvelteFlow 
      on:nodeclick={(event) => nodeClickedObserver.set(event)}
      on:nodedragstart={(event) => {nodeDraggedObserver.set(event)}}
      {nodes} {edges} {proOptions} {nodeTypes} nodesConnectable={false} deleteKey={"Delete"} fitView
      >
        <Controls position={"top-center"} orientation={"horizontal"}>
          <HidePythonEditorButton />
          <HideVisualEditorButton />
          <HidePythonTerminalButton />
          <AddChartButton/>
          <SaveSetupButton />
          <LoadSetupButton />
          <UploadDatasetButton />
        </Controls>
        <Background />
        <MiniMap />
      </SvelteFlow>
  </SvelteFlowProvider>  
  </div>
</div>

<!-- We create three Pane-Groups to support resizing of Monaco Editors -->
<PaneGroup direction="horizontal" style="height: 100vh;">

  <Pane id="left-pane" defaultSize={33} minSize={20} style="z-index: 3;">
    <PythonModelEditor />    
  </Pane>
  <PaneResizer style="z-index: 2;">
    <div class="pane-resizer"></div>
  </PaneResizer>
  
  <Pane style="z-index: -10;">
    <div class="hidden hidden-pane"></div>
  </Pane>

  <PaneResizer style="z-index: 2;">
    <div class="pane-resizer"></div>
  </PaneResizer>
  <Pane id="right-pane" defaultSize={33} minSize={20} style="z-index: 3;">
    <VisualModelEditor />
  </Pane>

</PaneGroup>
  

<style>
  .flow-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Lower z-index so it’s "under" the Monaco overlay */
  }

  .pane-resizer {
    width: 5px;
    z-index: 2;
  }

  .hidden-pane {
    z-index: -10;
  }
</style>
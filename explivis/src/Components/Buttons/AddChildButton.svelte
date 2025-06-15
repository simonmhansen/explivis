<script lang="ts">
import { type Readable, get } from "svelte/store";
import type { InternalNode, XYPosition } from "@xyflow/svelte";
import { chartHandler } from "../../stores";
import type { NodeMeasures } from "../../Interfaces/ChartHandler";


export let id: string;
export let parentInternalNode: Readable<InternalNode|undefined>;


function getAbsolutePosition(node: Readable<InternalNode|undefined>) : XYPosition {
    let position: XYPosition = {x: 0, y: 0};
    

    try {
        if (isInternalNode(node)) {
            position = get(node).position

        }
    } catch (error) {
        console.error(error)
    }


    return position;
}

function getMeasures(node : Readable<InternalNode|undefined>) : NodeMeasures {
    let measures = {"width": 0, "height": 0}
    
    try {
        if (isInternalNode(node)) {
            measures = get(node).measured

        }
    } catch (error) {
        console.error(error)
    }

    return measures
}

function isInternalNode(node: Readable<InternalNode|undefined>): node is Readable<InternalNode> {
    return parentInternalNode !== undefined && get(parentInternalNode) !== undefined && 'position' in get(parentInternalNode);   
}

</script>
    
    
<button class="btn btn-outline bg-[#FAFAFA] mt-1 pl-3 pr-3" style="animation: none"
    on:click={(e) => chartHandler.addChildChart(id, getAbsolutePosition(parentInternalNode), getMeasures(parentInternalNode))}
>
    Add Child
</button>
    
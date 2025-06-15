<script lang="ts">
import { type Readable, get } from 'svelte/store';
import { NODE_ID_STRING } from '../constants';
import { Handle, Position, NodeToolbar, useSvelteFlow, type NodeProps, type Align, type XYPosition, type InternalNode, useInternalNode } from '@xyflow/svelte';
import AddChildButton from '../Components/Buttons/AddChildButton.svelte'
import ClearNodeContentsButton from '../Components/Buttons/ClearNodeContentsButton.svelte';

type $$Props = NodeProps;
export let data = { label: 'Node' };
export let targetPosition = undefined;
export let sourcePosition = undefined;
// this is a workaround for suppressing the warning about unused props
$$restProps;

let internalNode : Readable<InternalNode|undefined> = useInternalNode($$restProps.id)

let toolbarPosition: Position = Position.Bottom
let align: Align = "center"
let offset: number = 0


</script>

{data?.label}
{#if targetPosition}
<Handle type="target" position={targetPosition ?? Position.Right} />    
{/if}
<Handle type="source" position={sourcePosition ?? Position.Right} />
<div id={`${NODE_ID_STRING}${$$restProps.id}`} style="transform: none;">
     
</div>
<NodeToolbar position={toolbarPosition} {align} {offset}>
    <AddChildButton id={$$restProps.id} parentInternalNode={internalNode}/>
    <ClearNodeContentsButton id={$$restProps.id} />
</NodeToolbar>
<style>
    :global(.svelte-flow__node-chartNode) {
      font-size: 12px;
      background: #eee;
      border: 1px solid #555;
      border-radius: 5px;
      text-align: center;
      min-width: 100px;
      min-height: 30px;
    }
  </style>
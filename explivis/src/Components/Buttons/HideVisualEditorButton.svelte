<script lang="ts">
import { visualEditorVisible } from "../../stores";
import { ControlButton } from "@xyflow/svelte";


function handleClick() : void {
    visualEditorVisible.update(visible => !visible)
}

</script>
    
<ControlButton 
    class="svelte-flow__controls-addchart"
    on:click={() => handleClick()}
    title="toggle visual editor"
    aria-label="toggle visual editor"
    >
<svg
	width="36"
	height="36"
	viewBox="0 0 20 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="oi-caret-left">
		<path
			class="oi-vector"
			d="M14 15.9325C14 16.3564 13.5056 16.588 13.1799 16.3166L8.46093 12.3841C8.22105 12.1842 8.22106 11.8158 8.46093 11.6159L13.1799 7.68341C13.5056 7.41202 14 7.6436 14 8.06752L14 15.9325Z"
			stroke="#000000"
			stroke-width="1.5"
			stroke-miterlimit="10"
		/>
	</g>
</svg>
</ControlButton>
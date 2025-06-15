<script lang="ts">
import { pythonEditorVisible } from "../../stores";
import { ControlButton } from "@xyflow/svelte";


function handleClick() : void {
    pythonEditorVisible.update(visible => !visible)
}

</script>
    
    
<ControlButton 
    class="svelte-flow__controls-addchart"
    on:click={() => handleClick()}
    title="toggle python editor"
    aria-label="toggle python editor"
    >
	<svg
	width="36"
	height="36"
	viewBox="0 0 20 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="oi-caret-right">
		<path
			class="oi-vector"
			d="M10 8.06752C10 7.6436 10.4944 7.41202 10.8201 7.68341L15.5391 11.6159C15.7789 11.8158 15.7789 12.1842 15.5391 12.3841L10.8201 16.3166C10.4944 16.588 10 16.3564 10 15.9325L10 8.06752Z"
			stroke="#000000"
			stroke-width="1.5"
			stroke-miterlimit="10"
		/>
	</g>
</svg>
</ControlButton>
            
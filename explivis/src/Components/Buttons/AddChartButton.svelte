<script lang="ts">
import { ControlButton } from "@xyflow/svelte";
import { chartHandler, nodes } from "../../stores";
</script>


<ControlButton 
    class="svelte-flow__controls-addchart"
    on:click={() => chartHandler.addNewChart()}
    title="add chart"
    aria-label="add chart"
    >

    <svg
	width="50"
	height="50"
	viewBox="0 0 20 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="oi-analysis">
		<path
			class="oi-line"
			d="M5 5V21"
			stroke="#000000"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			class="oi-line"
			d="M20 19H3"
			stroke="#000000"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			class="oi-line"
			d="M9 11V15"
			stroke="#000000"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			class="oi-line"
			d="M13 7V15"
			stroke="#000000"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			class="oi-line"
			d="M17 9V15"
			stroke="#000000"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</g>
</svg>
</ControlButton>

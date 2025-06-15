<script lang="ts">
import { ControlButton } from "@xyflow/svelte";
import { saveHandler } from "../../stores";
</script>


<ControlButton 
    class="svelte-flow__controls-savesetup"
    on:click={() => saveHandler.saveSetup()}
    title="save setup"
    aria-label="save setup"
    >
    <span class="icon-[tabler--device-floppy] size_10"></span>
</ControlButton>

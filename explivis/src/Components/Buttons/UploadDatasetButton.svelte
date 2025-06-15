<script lang="ts">
import { ControlButton } from "@xyflow/svelte";
import { datasetHandler } from "../../stores";
    import { Terminal } from "../../../pyscript/xterm-7LwxAMsn";
const DATASET_UPLOAD_INPUT_ELEMENT_ID : string = "upload-dataset-input"


function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        const file = input.files[0]
        try {
            datasetHandler.uploadDataset(file)
        } catch (error) {
            console.error(error)
        }
    }
}

function triggerFilePicker() {
    const inputElement = document.getElementById(DATASET_UPLOAD_INPUT_ELEMENT_ID)
    inputElement?.click()
}

</script>

<ControlButton 
    class="svelte-flow__controls-uploaddata"
    on:click={() => triggerFilePicker()}
    title="upload dataset"
    aria-label="upload dataset"
    >
    <span class="icon-[tabler--file-import] size_10"></span>
</ControlButton>
<input
    id="{DATASET_UPLOAD_INPUT_ELEMENT_ID}"
    type="file"
    accept=".json"
    on:change={onFileChange}
    style="display: none"
/>
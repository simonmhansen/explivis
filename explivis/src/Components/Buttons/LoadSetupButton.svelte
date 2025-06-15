<script lang="ts">
import { ControlButton } from "@xyflow/svelte";
import { saveHandler } from "../../stores";
const SAVE_FILE_UPLOAD_INPUT_ELEMENT_ID : string = "save-file-upload-input"


function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        const file = input.files[0]
        try {
            saveHandler.loadSaveData(file)
        } catch (error) {
            console.error(error)
        }
    }
}

function triggerFilePicker() {
    const inputElement = document.getElementById(SAVE_FILE_UPLOAD_INPUT_ELEMENT_ID)
    inputElement?.click()
}

</script>

<ControlButton 
    class="svelte-flow__controls-loadsetup"
    on:click={() => triggerFilePicker()}
    title="load setup"
    aria-label="load setup"
    >
    <span class="icon-[tabler--upload] size_10"></span>
</ControlButton>
<input
    id="{SAVE_FILE_UPLOAD_INPUT_ELEMENT_ID}"
    type="file"
    accept=".json"
    on:change={onFileChange}
    style="display: none"
/>
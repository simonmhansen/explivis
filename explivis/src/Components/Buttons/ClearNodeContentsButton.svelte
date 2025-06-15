<script lang="ts">
export let id: string;

function clearNodeContents() {
    let nodeContainer : HTMLElement = document.querySelector(`#nodecontents-${id}`)
    try {
        nodeContainer.innerHTML = "";    
    } catch (error) {
        console.error(`Failed to remove contents of node ${id}`)
    }
}
</script>
    
    
<button class="btn btn-outline bg-[#FAFAFA] mt-1 pl-3 pr-3" style="animation: none"
    on:click={(e) => clearNodeContents()}
>
    Clear Contents
</button>
    
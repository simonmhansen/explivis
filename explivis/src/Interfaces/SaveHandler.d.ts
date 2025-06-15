import type { Node, XYPosition } from "@xyflow/svelte"

export interface SaveHandler {
    /**
     * Saves the current setup
     */
    saveSetup() : void

    /**
     * Transform the node (Chart) into a save-structure
     * @param node a Svelte-Flow node
     */
    saveNode(node : Node) : NodeSaveData

    /**
     * Stores the save data in persistent memory
     * @param utilityLibraryCode the Utility Library code
     * @param savedFlowNodes the save-data structure for all Charts
     */
    storeSaveData(utilityLibraryCode : string, savedFlowNodes : NodeSaveData[]) : void

    /**
     * Loads in a given save file
     * @param file a savefile
     */
    loadSaveData(file : File) : void

    /**
     * Restores a setup from its saved data
     * @param saveData saved data to restore a setup
     */
    restoreSetup(saveData: SaveData) : void
}
export type SaveData = {
    utilityLibraryCode : string,
    nodes : NodeSaveData[] 
}
export type NodeSaveData = {
    id : string
    position : XYPosition
    pythonModelContents : string
    visualModelContents : string
    parentId : string
}
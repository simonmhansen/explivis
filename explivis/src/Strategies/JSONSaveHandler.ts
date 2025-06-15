import type { Node } from "@xyflow/svelte";
import type { SaveData, NodeSaveData, SaveHandler } from "../Interfaces/SaveHandler";
import { chartHandler, monacoHandler, nodes, notyf, pythonHandler, pythonHandlerReady, savedNodesRestoredObserver, visualModelHandler } from "../stores";
import { get } from "svelte/store";
import { NODE_ID_STRING, NOPARENT_STRING, SAVEFILE_NAME } from "../constants";
import type { AddChartData } from "../Interfaces/ChartHandler";
import type { SavedNodesRestoredEvent } from "../Interfaces/FlowEvents";
import { tick } from "svelte";
import { PythonResult } from "../Interfaces/PythonResult";
import { isSubtreeError, SubtreeError } from "../utility";

export class JSONSaveHandler implements SaveHandler {

    constructor() {
        savedNodesRestoredObserver.subscribe((savedNodesRestoredEvent) => {
            if (savedNodesRestoredEvent === undefined) { return; }

            this.handleRestoredSavedNodes(savedNodesRestoredEvent);
        })
    }

    saveSetup(): void {
        let flowNodes = get(nodes);
        let savedFlowNodes = flowNodes.map((node) => this.saveNode(node));
        let utilityLibraryCode = monacoHandler.getUtilityLibrary().getValue()

        this.storeSaveData(utilityLibraryCode, savedFlowNodes);
    }


    saveNode(node: Node): NodeSaveData {
        let saveData : NodeSaveData = {
            id : node.id,
            position : node.position,
            pythonModelContents: monacoHandler.getPythonModel(node.id).getValue(),
            visualModelContents: monacoHandler.getVisualModel(node.id).getValue(),
            parentId : chartHandler.getParentId(node.id)
        }
        
        return saveData
    }


    storeSaveData(utilityLibraryCode : string, savedFlowNodes : NodeSaveData[]) : void {
        let saveData : SaveData = {
            "utilityLibraryCode": utilityLibraryCode,
            "nodes": savedFlowNodes,
        }

        const json = JSON.stringify(saveData, null, 2);

        // Create a Blob
        const blob = new Blob([json], { type : "application/json"});

        // Trigger a download by force-clicking an 'a'-DOM-node
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a");

        a.href = url;
        a.download = SAVEFILE_NAME // File name

        // Add child, force-click it, and clean up
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    savedNodeHasParent(saveData : NodeSaveData) : boolean {
        return saveData.parentId === NOPARENT_STRING
    }

    restoreSetup(saveData: SaveData) : void {
        // A map for pointing save-ids to new ids
        let idMap : Map<string, string> = new Map();
        let newNodesList : Array<AddChartData> = [];

        let saveDataArray = saveData.nodes
        monacoHandler.appendToUtilityLibrary(saveData.utilityLibraryCode)

        // Invariant Assumption: Parent nodes are created before Child Nodes
        // Invariant Assumption: Nodes in the savefile have unique IDs
        // Invariant is upheld by saving using get(nodes) from SvelteFlow in saveSetup()
        saveDataArray.forEach((savedNode) => {
            let newChart : AddChartData;

            // If Parent/Root node: Create such as node
            if (this.savedNodeHasParent(savedNode)) {
                newChart = chartHandler.addNewChart();
            }

            // If node has a Parent, then create the node as a child
            else {
                let parentId = idMap.get(savedNode.parentId) as string
                newChart = chartHandler.addChildChart(parentId, savedNode.position, {"width": 0, "height": 0})
            }

            // Common functionality: Restore position, pythonModel, visualModel
            let savedId = savedNode.id
            let newId = newChart.nodeObject.id
            idMap.set(savedId, newChart.nodeObject.id)

            // Set monaco models
            let pythonModel = monacoHandler.getPythonModel(newId)
            pythonModel.setValue(savedNode.pythonModelContents)

            let visualModel = monacoHandler.getVisualModel(newId)
            visualModel.setValue(savedNode.visualModelContents)

            // Set position
            newChart.nodeObject.position = savedNode.position

            newNodesList.push(newChart)

        })

        savedNodesRestoredObserver.set(new CustomEvent('savedNodesRestoredEvent', {
            detail: newNodesList
        }))
    }

    /**
     * Listens on nodes being restored from a save file. This is because we must
     * give the DOM the opportunity to create its elements before we risk
     * embedding visualisations into non-existing DOM-objects.
     * Could be solved by making restoreSetup asynchronous and putting tick() in there 
     * after addNewChart/addChildChart, but this is not what we want.
     * @param savedNodesRestoredEvent event that some nodes have been restored from a save file
     */
    async handleRestoredSavedNodes(savedNodesRestoredEvent : SavedNodesRestoredEvent) {
        await tick(); // Let DOM update

        let newNodesList : Array<AddChartData> = savedNodesRestoredEvent.detail

        for (const savedNode of newNodesList) { 
            let newId = savedNode.nodeObject.id

            let pythonCode = monacoHandler.getPythonModel(newId).getValue()
            let visualisationCode = monacoHandler.getVisualModel(newId).getValue()


            //First execute Python code, then execute visualisation code (since it can depend on the Python)
            try {
                let res = await pythonHandler.runPython(newId, pythonCode)
                if (res.type != PythonResult.Success) {
                    res = res.type == PythonResult.Warning ? res : {type: PythonResult.Error, message: "Failed to execute Python Code in save file"}
                    throw new SubtreeError("Failed to execute Python Code in save file", res)
                } 

                let visRes = await visualModelHandler.embedVisualisation(newId, visualisationCode); 
                if (!visRes) {
                    throw new SubtreeError("Failed to execute Visualisation Code in save file", {type: PythonResult.Error, message: "Failed to execute Visualisation Code in save file"})
                }

            } catch (error) {
                console.error(error)

                if (!isSubtreeError(error)) {
                    notyf.error("Failed to upload save file")
                    return;
                } 

                if (error.pythonResult.type === PythonResult.Warning) {
                    notyf.open({type: "warning", message: error.pythonResult.message ? error.pythonResult.message : "Failed to upload save file"}) 
                    return;
                }

                notyf.error(error.pythonResult.message ? error.pythonResult.message : "Failed to upload save file")
                return;

            }
        }

        notyf.success("Save file uploaded successfully")

    }

    loadSaveData(file: File) : void {
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const result: string = event.target?.result as string;
                const saveData: SaveData = JSON.parse(result)
                this.restoreSetup(saveData)
            } catch (error) {
                console.error("Error parsing Save Data JSON:", error)
            }
        }
        reader.onerror = () => console.error("Error parsing Save Data JSON")
        reader.readAsText(file)
    }
}
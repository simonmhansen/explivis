import type { Node } from "@xyflow/svelte";

/**
 * Handles the datastructures for creating Charts
 */
export interface ChartHandler {
    /**
     * Adds a new Chart
     */
    addNewChart(): AddChartData;

    /**
     * Creates a child Chart
     * @param parentId id of the parent Chart
     * @param position position
     * @param measures measures for the node
     */
    addChildChart(parentId: string, position: XYPosition, measures: NodeMeasures): AddChartData;

    /**
     * Returns the id for the parent of the supplied node
     * @param id id of the supplied node 
     */
    getParentId(id: string) : string

    /**
     * Returns the ids of all children
     * @param id id of the parent
     */
    getChildrenIds(id: string): string[]
}

export type AddChartData = {
    nodeObject: Node,
    edgeObject: Edge | null
}

export type NodeMeasures = {
    "width": number,
    "height": number
}
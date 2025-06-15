import { nextId, nodes, edges, nodeCreatedObserver } from "../stores";
import type { ChartHandler, AddChartData, NodeMeasures } from "../Interfaces/ChartHandler";
import { get } from "svelte/store";
import {
    Position,
    addEdge,
    type XYPosition,
    type Node,
    type Edge,
  } from '@xyflow/svelte';
import { NOPARENT_STRING } from "../constants";

const CHILD_TO_PARENT_HORIZONTAL_MARGIN : number = 125;
const NODE_STANDARD_HEIGHT : number = 30;

export class StandardChartHandler implements ChartHandler {
    childIdToParentIdMap : Map<string, string>
    parentIdToChildrenIdsMap: Map<string, string[]>
    

    constructor() {
        this.childIdToParentIdMap = new Map();
        this.parentIdToChildrenIdsMap = new Map();
    }

    addNewChart(): AddChartData {
        let id = String(get(nextId))
        nextId.update(i => i + 1);
        let newChart: Node = {
            id: id ,
            type: 'chartNode',
            sourcePosition: Position.Right,
            data: {label: ""}, // Label sets some inner text, but we want empty nodes
            position: { x: 0, y: 0 },
        }

        nodes.update(nodeList => [...nodeList, newChart])

        let addChartData : AddChartData = {
            nodeObject: newChart,
            edgeObject: null
        }

        nodeCreatedObserver.set(new CustomEvent('nodeCreatedEvent', {
            detail: addChartData
        }))

        this.childIdToParentIdMap.set(id, NOPARENT_STRING)
        this.parentIdToChildrenIdsMap.set(id, [])

        return addChartData;
    }

    addChildChart(parentId: string, position: XYPosition, measures: NodeMeasures) : AddChartData {
        let childId = String(get(nextId))
        nextId.update(i => i + 1);
        let newChart: Node = {
            id: childId ,
            type: 'chartNode',
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {label : ""},
            position: { x: position.x + measures.width + CHILD_TO_PARENT_HORIZONTAL_MARGIN, y: position.y + (measures.height / 2) - (NODE_STANDARD_HEIGHT / 2) },
        }

        nodes.update(nodeList => [...nodeList, newChart]);

        let newEdge: Edge = {
            id: parentId + "-" + childId,
            source: parentId,
            target: childId,
        }

        edges.update(edgeList => addEdge(newEdge, edgeList))

        let addChartData : AddChartData = {
            nodeObject: newChart,
            edgeObject: newEdge
        }

        nodeCreatedObserver.set(new CustomEvent('nodeCreatedEvent', {
            detail: addChartData
        }))

        this.childIdToParentIdMap.set(childId, parentId)
        let siblings = this.parentIdToChildrenIdsMap.get(parentId)
        if (!siblings) {
            siblings = []
        }
        siblings?.push(childId)
        this.parentIdToChildrenIdsMap.set(parentId, siblings)

        return addChartData;

    }

    getParentId(id: string): string {
        let parentId = this.childIdToParentIdMap.get(id)
        if (typeof parentId === 'string') {
            return parentId
        } else {
            return NOPARENT_STRING
        }
    }

    getChildrenIds(id: string): string[] {
        let children = this.parentIdToChildrenIdsMap.get(id)
        if (Array.isArray(children) && children.every(child => typeof child === 'string')) {
            return children
        }
        else {
            return []
        }
    }
}
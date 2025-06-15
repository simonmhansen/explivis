import type { AddChartData } from "../Strategies/StandardChartHandler";

export interface NodeClickedDetail {
    node: Node<Record<string, unknown>, string>;
    event: MouseEvent | TouchEvent;
}

export interface NodeDraggedDetail {
    targetNode: Node<Record<string, unknown>, string>;
    nodes:Node<Record<string, unknown>, string>[];
    event: MouseEvent | TouchEvent;
}

export type NodeClickedEvent = CustomEvent<NodeClickedDetail>
export type NodeDraggedEvent = CustomEvent<NodeDraggedDetail>

// Personal Event

export type NodeCreatedEvent = CustomEvent<AddChartData>
export type SavedNodesRestoredEvent = CustomEvent<Array<AddChartData>>
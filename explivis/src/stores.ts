import { writable } from 'svelte/store';
import {
    type Node,
    type Edge,
  } from '@xyflow/svelte';
import { Notyf } from 'notyf';

import type { PythonHandler } from './Interfaces/PythonHandler';
import { PyScriptPythonHandler } from './Strategies/PyscriptPythonHandler';
import { StandardChartHandler } from './Strategies/StandardChartHandler';
import type { NodeClickedEvent, NodeCreatedEvent, NodeDraggedEvent, SavedNodesRestoredEvent } from './Interfaces/FlowEvents';
import type { MonacoHandler } from './Interfaces/MonacoHandler';
import { StandardMonacoHandler } from './Strategies/StandardMonacoHandler';
import type { VisualModelHandler } from './Interfaces/VisualModelHandler';
import type { ChartHandler } from './Interfaces/ChartHandler';
import type { SaveHandler } from './Interfaces/SaveHandler';
import { JSONSaveHandler } from './Strategies/JSONSaveHandler';
import { VegaEmbedVisualModelHandler } from './Strategies/VegaEmbedVisualModelHandler';
import type { DatasetHandler } from './Interfaces/DatasetHandler';
import { FileDatasetHandler } from './Strategies/FileDatasetHandler';


export const visualEditorVisible = writable<boolean>(true);
export const pythonEditorVisible = writable<boolean>(true);
export const pythonHandler : PythonHandler = new PyScriptPythonHandler();
export const pythonHandlerReady = writable<boolean>(false);
export const nodeClickedObserver = writable<NodeClickedEvent>();
export const nodeDraggedObserver = writable<NodeDraggedEvent>();
export const nodeCreatedObserver = writable<NodeCreatedEvent>();
export const monacoHandler : MonacoHandler = new StandardMonacoHandler();
export const notyf : Notyf = new Notyf({duration: 3000, ripple: false, dismissible: true, types: [
  {
    type: 'warning',
    background: 'oklch(79.87% .164 73.09)',
    icon: { className: 'icon-[tabler--alert-triangle] !text-warning custom-alert-icon', tagName: 'i' },
    text: '',
    color: 'white'
  }
]});

export const visualModelHandler : VisualModelHandler = new VegaEmbedVisualModelHandler();
export const chartHandler : ChartHandler = new StandardChartHandler();
export const savedNodesRestoredObserver = writable<SavedNodesRestoredEvent>();
export const saveHandler : SaveHandler = new JSONSaveHandler();
export const datasetHandler : DatasetHandler = new FileDatasetHandler();


export function setPythonInterpreter(interpreter : any) {
  pythonHandler.setInterpreter(interpreter)
}

export const nextId = writable<number>(0);

export const nodes = writable<Node[]>([]);

export const edges = writable<Edge[]>([]);


export interface FlowTrack {
    id: string;
    name: string;
    color: string;
    peopleCount: number;
    startTime: number;
    finishTime: number;
}
export interface FlowColorPart {
    trackId: string;
    color: string;
    weight: number;
}
export interface FlowGroup {
    id: string;
    trackIds: string[];
    peopleCount: number;
    colorParts: FlowColorPart[];
    startTime: number;
    endTime: number;
}
export interface FlowMergeIncoming {
    groupId: string;
    time: number;
    peopleCount: number;
}
export interface FlowMerge {
    id: string;
    nodeNumber: number;
    segmentIdAfterNode: string;
    time: number;
    incoming: FlowMergeIncoming[];
    outputGroupId: string;
}
export type FlowEventKind = 'entry' | 'break';
export interface FlowEvent {
    id: string;
    kind: FlowEventKind;
    trackId: string;
    time: number;
    endTime: number;
    label?: string;
    minutes?: number;
}
export interface FlowGraph {
    tracks: FlowTrack[];
    groups: FlowGroup[];
    merges: FlowMerge[];
    events: FlowEvent[];
    startTime: number;
    endTime: number;
    finishGroupId: string;
    finishGroupIds: string[];
}
export interface FlowColorPartLayout extends FlowColorPart {
    y: number;
    height: number;
}
export interface FlowGroupLayout {
    id: string;
    xStart: number;
    xEnd: number;
    y: number;
    height: number;
    colorParts: FlowColorPartLayout[];
}
export interface FlowPointLayout {
    x: number;
    y: number;
    width: number;
}
export interface FlowConnectionLayout {
    id: string;
    trackId: string;
    color: string;
    source: FlowPointLayout;
    target: FlowPointLayout;
}
export interface FlowMergeLayout extends FlowMerge {
    x: number;
    y: number;
}
export interface FlowEventLayout extends FlowEvent {
    x: number;
    endX: number;
    y: number;
    color: string;
}
export interface FlowStartLayout {
    trackId: string;
    name: string;
    peopleCount: number;
    x: number;
    y: number;
    color: string;
}
export interface FlowLayout {
    startTime: number;
    endTime: number;
    width: number;
    height: number;
    axisY: number;
    leftMargin: number;
    rightMargin: number;
    ticks: number[];
    groups: FlowGroupLayout[];
    connections: FlowConnectionLayout[];
    finishConnections: FlowConnectionLayout[];
    merges: FlowMergeLayout[];
    events: FlowEventLayout[];
    starts: FlowStartLayout[];
    finish: { x: number; y: number; width: number };
}

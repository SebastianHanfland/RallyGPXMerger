import { createSelector } from '@reduxjs/toolkit';
import {
    getBranchId,
    getBranchNumbersSelector,
    getBranchTrackIds,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { listAllNodesOfTracks, NodeAtTrack } from '../../common/calculation/nodes/nodeFinder.ts';
import { getTrackStreetInfos } from '../calculation/getTrackStreetInfos.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { isTrackSegment, TrackComposition } from '../store/types.ts';
import { TrackStreetInfo, TrackWayPointType } from '../logic/resolving/types.ts';
import { getColor } from '../../utils/colorUtil.ts';

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

function parseTime(value: string | undefined): number | undefined {
    if (!value) {
        return undefined;
    }
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : undefined;
}

function orderTrackIds(trackIds: string[], trackOrder: Map<string, number>): string[] {
    return [...new Set(trackIds)].sort(
        (first, second) =>
            (trackOrder.get(first) ?? Number.MAX_SAFE_INTEGER) - (trackOrder.get(second) ?? Number.MAX_SAFE_INTEGER)
    );
}

function getColorParts(trackIds: string[], trackById: Map<string, TrackComposition>): FlowColorPart[] {
    const weights = trackIds.map((trackId) => Math.max(0, trackById.get(trackId)?.peopleCount ?? 0));
    const hasPeople = weights.some((weight) => weight > 0);
    return trackIds.map((trackId, index) => ({
        trackId,
        color: getColor(trackById.get(trackId) ?? { id: trackId }),
        weight: hasPeople ? weights[index]! : 1,
    }));
}

function getGroupPeopleCount(
    trackIds: string[],
    branchNumbers: Record<string, number | undefined>,
    fallback: number
): number {
    const calculatedNumber = branchNumbers[getBranchId([...trackIds])];
    return Math.max(0, calculatedNumber ?? fallback);
}

function getNodeTimesByTrack(
    tracks: FlowTrack[],
    trackCompositions: TrackComposition[],
    trackInfos: Map<string, TrackStreetInfo>,
    trackNodes: NodeAtTrack[]
): Map<string, Map<string, number>> {
    const nodeIds = new Set(trackNodes.map((node) => node.segmentIdAfterNode));
    const nodeTimesByTrack = new Map<string, Map<string, number>>();

    tracks.forEach((track) => {
        const composition = trackCompositions.find((candidate) => candidate.id === track.id);
        const info = trackInfos.get(track.id);
        if (!composition || !info) {
            return;
        }

        const nodeIdsOnTrack = composition.segments
            .filter(isTrackSegment)
            .map((segment) => segment.id)
            .filter((segmentId) => nodeIds.has(segmentId));
        const nodeWaypoints = info.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Node);
        const times = new Map<string, number>();

        nodeIdsOnTrack.forEach((nodeId, index) => {
            const time = parseTime(nodeWaypoints[index]?.frontArrival);
            if (time !== undefined) {
                times.set(nodeId, time);
            }
        });
        nodeTimesByTrack.set(track.id, times);
    });

    return nodeTimesByTrack;
}

export function buildFlowGraph(
    trackCompositions: TrackComposition[],
    trackStreetInfos: TrackStreetInfo[],
    trackNodes: NodeAtTrack[],
    branchNumbers: Record<string, number | undefined>
): FlowGraph | undefined {
    const trackInfoById = new Map(trackStreetInfos.map((info) => [info.id, info]));
    const tracks: FlowTrack[] = trackCompositions
        .map((track) => {
            const info = trackInfoById.get(track.id);
            if (!info || info.wayPoints.length === 0) {
                return undefined;
            }
            const startTime = parseTime(info.startFront);
            const finishTime = parseTime(info.arrivalBack);
            if (startTime === undefined || finishTime === undefined) {
                return undefined;
            }
            return {
                id: track.id,
                name: track.name ?? track.id,
                color: getColor(track),
                peopleCount: Math.max(0, track.peopleCount ?? 0),
                startTime,
                finishTime: Math.max(startTime, finishTime),
            };
        })
        .filter((track): track is FlowTrack => track !== undefined);

    if (tracks.length === 0) {
        return undefined;
    }

    const validTrackIds = new Set(tracks.map((track) => track.id));
    const trackOrder = new Map(tracks.map((track, index) => [track.id, index]));
    const trackById = new Map(trackCompositions.map((track) => [track.id, track]));
    const validTrackNodes = trackNodes.filter((node) =>
        node.segmentsBeforeNode.some((segment) => validTrackIds.has(segment.trackId))
    );
    const nodeTimesByTrack = getNodeTimesByTrack(tracks, trackCompositions, trackInfoById, validTrackNodes);

    const groups: FlowGroup[] = tracks.map((track) => ({
        id: `track:${track.id}`,
        trackIds: [track.id],
        peopleCount: track.peopleCount,
        colorParts: getColorParts([track.id], trackById),
        startTime: track.startTime,
        endTime: track.finishTime,
    }));
    const groupsById = new Map(groups.map((group) => [group.id, group]));
    const activeGroupByTrack = new Map(tracks.map((track) => [track.id, `track:${track.id}`]));
    const merges: FlowMerge[] = [];

    validTrackNodes.forEach((trackNode, index) => {
        const branchTrackIds = Object.values(getBranchTrackIds(trackNode))
            .filter((ids): ids is string[] => ids !== undefined)
            .map((ids) =>
                orderTrackIds(
                    ids.filter((trackId) => validTrackIds.has(trackId)),
                    trackOrder
                )
            )
            .filter((ids) => ids.length > 0);

        const incomingGroupIds = [
            ...new Set(branchTrackIds.flatMap((ids) => ids.map((trackId) => activeGroupByTrack.get(trackId)))),
        ].filter((groupId): groupId is string => groupId !== undefined);
        if (incomingGroupIds.length < 2) {
            return;
        }

        const incoming = incomingGroupIds.map((groupId) => {
            const group = groupsById.get(groupId)!;
            const branchTrackIdsForGroup = branchTrackIds
                .flatMap((ids) => ids)
                .filter((trackId) => activeGroupByTrack.get(trackId) === groupId);
            const times = branchTrackIdsForGroup
                .map((trackId) => nodeTimesByTrack.get(trackId)?.get(trackNode.segmentIdAfterNode))
                .filter((time): time is number => time !== undefined);
            const time = Math.max(group.startTime, ...(times.length > 0 ? times : [group.startTime]));
            return { groupId, time, peopleCount: group.peopleCount };
        });
        const mergeTime = Math.max(...incoming.map((branch) => branch.time));

        incoming.forEach((branch) => {
            const group = groupsById.get(branch.groupId);
            if (group) {
                group.endTime = Math.max(group.startTime, branch.time);
            }
        });

        const outputTrackIds = orderTrackIds(
            incoming.flatMap((branch) => groupsById.get(branch.groupId)?.trackIds ?? []),
            trackOrder
        );
        const outputGroupId = `node:${trackNode.segmentIdAfterNode}`;
        const outputPeopleCount = getGroupPeopleCount(
            outputTrackIds,
            branchNumbers,
            incoming.reduce((sum, branch) => sum + branch.peopleCount, 0)
        );
        const outputGroup: FlowGroup = {
            id: outputGroupId,
            trackIds: outputTrackIds,
            peopleCount: outputPeopleCount,
            colorParts: getColorParts(outputTrackIds, trackById),
            startTime: mergeTime,
            endTime: mergeTime,
        };
        groups.push(outputGroup);
        groupsById.set(outputGroup.id, outputGroup);
        outputTrackIds.forEach((trackId) => activeGroupByTrack.set(trackId, outputGroupId));
        merges.push({
            id: `merge:${trackNode.segmentIdAfterNode}`,
            nodeNumber: index + 1,
            segmentIdAfterNode: trackNode.segmentIdAfterNode,
            time: mergeTime,
            incoming,
            outputGroupId,
        });
    });

    const finishGroupIds = [...new Set(activeGroupByTrack.values())];
    const finishTime = Math.max(
        ...tracks.map((track) => track.finishTime),
        ...finishGroupIds.map((groupId) => groupsById.get(groupId)?.startTime ?? 0)
    );
    finishGroupIds.forEach((groupId) => {
        const group = groupsById.get(groupId);
        if (!group) {
            return;
        }
        group.endTime = Math.max(
            group.endTime,
            ...group.trackIds.map(
                (trackId) => tracks.find((track) => track.id === trackId)?.finishTime ?? group.endTime
            )
        );
    });
    const finishTrackIds = orderTrackIds(
        finishGroupIds.flatMap((groupId) => groupsById.get(groupId)?.trackIds ?? []),
        trackOrder
    );
    const finishGroupId = 'finish';
    groups.push({
        id: finishGroupId,
        trackIds: finishTrackIds,
        peopleCount: finishGroupIds.reduce((sum, groupId) => sum + (groupsById.get(groupId)?.peopleCount ?? 0), 0),
        colorParts: getColorParts(finishTrackIds, trackById),
        startTime: finishTime,
        endTime: finishTime,
    });

    const events: FlowEvent[] = tracks.flatMap((track) => {
        const info = trackInfoById.get(track.id);
        return (info?.wayPoints ?? [])
            .map((wayPoint, index): FlowEvent | undefined => {
                const kind: FlowEventKind | undefined =
                    wayPoint.type === TrackWayPointType.Entry
                        ? 'entry'
                        : wayPoint.type === TrackWayPointType.Break
                          ? 'break'
                          : undefined;
                if (!kind) {
                    return undefined;
                }
                const time = parseTime(wayPoint.frontArrival);
                if (time === undefined) {
                    return undefined;
                }
                const endTime = Math.max(time, parseTime(wayPoint.frontPassage) ?? time);
                return {
                    id: `${track.id}:${kind}:${wayPoint.entryId ?? wayPoint.breakId ?? index}`,
                    kind,
                    trackId: track.id,
                    time,
                    endTime,
                    label: wayPoint.streetName ?? undefined,
                    minutes: wayPoint.breakLength,
                };
            })
            .filter((event): event is FlowEvent => event !== undefined);
    });

    return {
        tracks,
        groups,
        merges,
        events,
        startTime: Math.min(...tracks.map((track) => track.startTime)),
        endTime: Math.max(finishTime, ...events.map((event) => event.endTime)),
        finishGroupId,
        finishGroupIds,
    };
}

function getWidthForPeople(peopleCount: number, pixelsPerPerson: number): number {
    return peopleCount > 0 ? Math.max(4, peopleCount * pixelsPerPerson) : 4;
}

function getPartLayout(group: FlowGroup, y: number, height: number, trackId: string): FlowColorPartLayout | undefined {
    const part = group.colorParts.find((candidate) => candidate.trackId === trackId);
    if (!part) {
        return undefined;
    }
    const totalWeight = group.colorParts.reduce((sum, candidate) => sum + candidate.weight, 0);
    let offset = -height / 2;
    for (const candidate of group.colorParts) {
        const partHeight = (height * candidate.weight) / totalWeight;
        if (candidate.trackId === trackId) {
            return { ...part, y: y + offset + partHeight / 2, height: partHeight };
        }
        offset += partHeight;
    }
    return undefined;
}

export function layoutFlowGraph(graph: FlowGraph): FlowLayout {
    const leftMargin = 120;
    const rightMargin = 80;
    const width = Math.max(1000, (graph.tracks.length + graph.merges.length + graph.events.length + 2) * 110);
    const totalPeople = Math.max(
        1,
        graph.tracks.reduce((sum, track) => sum + track.peopleCount, 0),
        ...graph.groups.map((group) => group.peopleCount)
    );
    const pixelsPerPerson = Math.min(6, 300 / totalPeople);
    const gap = 10;
    const startHeights = graph.tracks.map((track) => getWidthForPeople(track.peopleCount, pixelsPerPerson));
    const totalStartHeight =
        startHeights.reduce((sum, height) => sum + height, 0) + gap * Math.max(0, startHeights.length - 1);
    const height = Math.max(380, totalStartHeight + 150);
    const axisY = height - 55;
    const top = Math.max(45, (axisY - totalStartHeight) / 2);
    const timeRange = Math.max(1, graph.endTime - graph.startTime);
    const xForTime = (time: number) =>
        leftMargin +
        ((Math.max(graph.startTime, Math.min(graph.endTime, time)) - graph.startTime) / timeRange) *
            (width - leftMargin - rightMargin);
    const groupById = new Map(graph.groups.map((group) => [group.id, group]));
    const initialYByTrack = new Map<string, number>();
    let cursor = top;
    graph.tracks.forEach((track, index) => {
        const trackHeight = startHeights[index]!;
        initialYByTrack.set(track.id, cursor + trackHeight / 2);
        cursor += trackHeight + gap;
    });

    const centerByGroup = new Map<string, number>();
    graph.groups.forEach((group) => {
        if (group.id === graph.finishGroupId) {
            centerByGroup.set(group.id, height / 2);
            return;
        }
        const weightedCenters = group.trackIds
            .map((trackId) => ({
                center: initialYByTrack.get(trackId),
                weight: Math.max(0, graph.tracks.find((track) => track.id === trackId)?.peopleCount ?? 0),
            }))
            .filter((value): value is { center: number; weight: number } => value.center !== undefined);
        const totalWeight = weightedCenters.reduce((sum, value) => sum + value.weight, 0);
        const center =
            totalWeight > 0
                ? weightedCenters.reduce((sum, value) => sum + value.center * value.weight, 0) / totalWeight
                : weightedCenters.reduce((sum, value) => sum + value.center, 0) / Math.max(1, weightedCenters.length);
        centerByGroup.set(group.id, center || height / 2);
    });

    const groupLayouts: FlowGroupLayout[] = graph.groups.map((group) => {
        const groupHeight = getWidthForPeople(group.peopleCount, pixelsPerPerson);
        const y = centerByGroup.get(group.id) ?? height / 2;
        return {
            id: group.id,
            xStart: xForTime(group.startTime),
            xEnd: xForTime(group.endTime),
            y,
            height: groupHeight,
            colorParts: group.colorParts
                .map((part) => getPartLayout(group, y, groupHeight, part.trackId))
                .filter((part): part is FlowColorPartLayout => part !== undefined),
        };
    });
    const groupLayoutById = new Map(groupLayouts.map((group) => [group.id, group]));
    const connections: FlowConnectionLayout[] = [];

    graph.merges.forEach((merge) => {
        const targetGroup = groupLayoutById.get(merge.outputGroupId);
        const outputGroup = groupById.get(merge.outputGroupId);
        if (!targetGroup || !outputGroup) {
            return;
        }
        merge.incoming.forEach((incoming) => {
            const sourceGroup = groupLayoutById.get(incoming.groupId);
            const source = groupById.get(incoming.groupId);
            if (!sourceGroup || !source) {
                return;
            }
            source.trackIds.forEach((trackId) => {
                const sourcePart = getPartLayout(source, sourceGroup.y, sourceGroup.height, trackId);
                const targetPart = getPartLayout(outputGroup, targetGroup.y, targetGroup.height, trackId);
                const track = graph.tracks.find((candidate) => candidate.id === trackId);
                if (!sourcePart || !targetPart || !track) {
                    return;
                }
                connections.push({
                    id: `${merge.id}:${incoming.groupId}:${trackId}`,
                    trackId,
                    color: track.color,
                    source: { x: sourceGroup.xEnd, y: sourcePart.y, width: sourcePart.height },
                    target: { x: targetGroup.xStart, y: targetPart.y, width: targetPart.height },
                });
            });
        });
    });

    const finishGroup = groupById.get(graph.finishGroupId)!;
    const finishLayout = groupLayoutById.get(graph.finishGroupId)!;
    const finishConnections: FlowConnectionLayout[] = [];
    graph.finishGroupIds.forEach((groupId) => {
        const sourceGroup = groupLayoutById.get(groupId);
        const source = groupById.get(groupId);
        if (!sourceGroup || !source) {
            return;
        }
        source.trackIds.forEach((trackId) => {
            const sourcePart = getPartLayout(source, sourceGroup.y, sourceGroup.height, trackId);
            const targetPart = getPartLayout(finishGroup, finishLayout.y, finishLayout.height, trackId);
            const track = graph.tracks.find((candidate) => candidate.id === trackId);
            if (!sourcePart || !targetPart || !track) {
                return;
            }
            finishConnections.push({
                id: `finish:${groupId}:${trackId}`,
                trackId,
                color: track.color,
                source: { x: sourceGroup.xEnd, y: sourcePart.y, width: sourcePart.height },
                target: { x: finishLayout.xStart, y: targetPart.y, width: targetPart.height },
            });
        });
    });

    const events: FlowEventLayout[] = graph.events.flatMap((event) => {
        const eventGroup = graph.groups
            .filter((group) => group.id !== graph.finishGroupId && group.trackIds.includes(event.trackId))
            .filter((group) => event.time >= group.startTime && event.time <= group.endTime)
            .sort((first, second) => second.startTime - first.startTime)[0];
        const groupLayout = eventGroup ? groupLayoutById.get(eventGroup.id) : undefined;
        const track = graph.tracks.find((candidate) => candidate.id === event.trackId);
        const part =
            eventGroup && groupLayout
                ? getPartLayout(eventGroup, groupLayout.y, groupLayout.height, event.trackId)
                : undefined;
        if (!groupLayout || !track || !part) {
            return [];
        }
        return [{ ...event, x: xForTime(event.time), endX: xForTime(event.endTime), y: part.y, color: track.color }];
    });

    const starts = graph.tracks.map((track) => ({
        trackId: track.id,
        name: track.name,
        peopleCount: track.peopleCount,
        x: xForTime(track.startTime),
        y: initialYByTrack.get(track.id) ?? height / 2,
        color: track.color,
    }));
    const merges = graph.merges.map((merge) => ({
        ...merge,
        x: xForTime(merge.time),
        y: centerByGroup.get(merge.outputGroupId) ?? height / 2,
    }));
    const ticks = Array.from({ length: 6 }, (_, index) => graph.startTime + (timeRange * index) / 5);

    return {
        startTime: graph.startTime,
        endTime: graph.endTime,
        width,
        height,
        axisY,
        leftMargin,
        rightMargin,
        ticks,
        groups: groupLayouts.filter((group) => group.id !== graph.finishGroupId),
        connections,
        finishConnections,
        merges,
        events,
        starts,
        finish: { x: xForTime(graph.endTime), y: height / 2, width: finishLayout.height },
    };
}

export const getFlowOverviewGraph = createSelector(
    [getTrackCompositions, getTrackStreetInfos, getBranchNumbersSelector],
    (trackCompositions, trackStreetInfos, branchNumbers) =>
        buildFlowGraph(trackCompositions, trackStreetInfos, listAllNodesOfTracks(trackCompositions), branchNumbers)
);

import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../planner/store/trackMerge.reducer.ts';
import { getGpxSegments } from '../../planner/store/gpxSegments.reducer.ts';
import { listAllNodesOfTracks, TrackNode } from '../../planner/logic/merge/helper/nodeFinder.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { TrackComposition } from '../../planner/store/types.ts';

export interface NodePosition {
    point: { lat: number; lon: number };
    tracks: string[];
}

function getTracks(segmentId: string, trackNodes: TrackNode[], trackCompositions: TrackComposition[]): string[] {
    const foundTrackNode = trackNodes.find((node) =>
        node.segmentsBeforeNode.map((beforeNode) => beforeNode.segmentId).includes(segmentId)
    );
    return (
        foundTrackNode?.segmentsBeforeNode.map((beforeNode) => {
            const foundTrackComposition = trackCompositions.find((track) => track.id === beforeNode.trackId);
            return foundTrackComposition?.name ?? '';
        }) ?? []
    );
}

export const getNodePositions = createSelector(
    getTrackCompositions,
    getGpxSegments,
    (trackCompositions, gpxSegments): NodePosition[] => {
        const trackNodes = listAllNodesOfTracks(trackCompositions);
        const segmentIdsBeforeNode = trackNodes.flatMap((trackNode) =>
            trackNode.segmentsBeforeNode.map((tr) => tr.segmentId)
        );

        const nodePositions: NodePosition[] = [];

        segmentIdsBeforeNode.forEach((segmentId) => {
            const foundSegment = gpxSegments.find((gpxSegment) => gpxSegment.id === segmentId);
            if (foundSegment) {
                const simpleGPX = SimpleGPX.fromString(foundSegment.content);
                const lastTrackIndex = simpleGPX.tracks.length - 1;
                const lastPointOfSegment =
                    simpleGPX.tracks[lastTrackIndex].points[simpleGPX.tracks[lastTrackIndex].points.length - 1];
                nodePositions.push({
                    point: lastPointOfSegment,
                    tracks: getTracks(segmentId, trackNodes, trackCompositions),
                });
            }
        });
        return nodePositions;
    }
);

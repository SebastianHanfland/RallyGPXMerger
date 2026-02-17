import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks, TrackNode } from '../../calculate/helper/nodeFinder.ts';
import { TrackComposition } from '../../../store/types.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { getLatLon } from '../../../../utils/pointUtil.ts';

export interface NodePosition {
    point: { lat: number; lon: number };
    tracks: string[];
    segmentIdAfter: string;
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
    getParsedGpxSegments,
    (trackCompositions, parsedTracks): NodePosition[] => {
        const trackNodes = listAllNodesOfTracks(trackCompositions);
        const segmentIdsBeforeNode = trackNodes.flatMap((trackNode) =>
            trackNode.segmentsBeforeNode.map((tr) => tr.segmentId)
        );

        const nodePositions: NodePosition[] = [];

        segmentIdsBeforeNode.forEach((segmentId) => {
            const foundSegment = parsedTracks?.find((gpxSegment) => gpxSegment.id === segmentId);
            if (foundSegment) {
                const lastPointOfSegment = foundSegment.points[foundSegment.points.length - 1];
                nodePositions.push({
                    point: getLatLon(lastPointOfSegment),
                    tracks: getTracks(segmentId, trackNodes, trackCompositions),
                    segmentIdAfter: segmentId,
                });
            }
        });
        return nodePositions;
    }
);

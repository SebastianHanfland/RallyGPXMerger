import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../../store/trackMerge.reducer';
import { listAllNodesOfTracks, NodeAtTrack } from '../../../../common/calculation/nodes/nodeFinder';
import { TrackComposition } from '../../../store/types';
import { getParsedGpxSegments } from '../../../store/segmentData.redux';
import { getLatLon } from '../../../../utils/pointUtil';
import { getNodeStreetNames } from '../../../store/nodes.reducer';

export interface NodePosition {
    point: { lat: number; lon: number };
    tracks: string[];
    segmentIdAfter: string;
    streetName?: string;
}

function getTracks(segmentId: string, trackNodes: NodeAtTrack[], trackCompositions: TrackComposition[]): string[] {
    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === segmentId);
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
    getNodeStreetNames,
    (trackCompositions, parsedTracks, nodeStreetNames): NodePosition[] => {
        const trackNodes = listAllNodesOfTracks(trackCompositions);
        const segmentIdsAfterNode = trackNodes.map((trackNode) => trackNode.segmentIdAfterNode);

        const nodePositions: NodePosition[] = [];

        segmentIdsAfterNode.forEach((segmentId) => {
            const foundSegment = parsedTracks?.find((gpxSegment) => gpxSegment.id === segmentId);
            if (foundSegment && foundSegment.points.length > 0) {
                const lastPointOfSegment = foundSegment.points[0];
                nodePositions.push({
                    point: getLatLon(lastPointOfSegment),
                    tracks: getTracks(segmentId, trackNodes, trackCompositions),
                    segmentIdAfter: segmentId,
                    streetName: nodeStreetNames[segmentId],
                });
            }
        });
        return nodePositions;
    }
);

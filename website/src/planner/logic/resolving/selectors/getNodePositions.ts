import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { listAllNodesOfTracks, TrackNode } from '../../merge/helper/nodeFinder.ts';
import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { TrackComposition } from '../../../store/types.ts';
import { getGpx } from '../../../../common/cache/gpxCache.ts';

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
                const simpleGPX = getGpx(foundSegment);
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

function getTrueTracks(segmentId: string, trackNodes: TrackNode[], trackCompositions: TrackComposition[]): string[] {
    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === segmentId);
    return (
        foundTrackNode?.segmentsBeforeNode.map((beforeNode) => {
            const foundTrackComposition = trackCompositions.find((track) => track.id === beforeNode.trackId);
            return foundTrackComposition?.name ?? '';
        }) ?? []
    );
}

export const getTrueNodePositions = createSelector(
    getTrackCompositions,
    getGpxSegments,
    (trackCompositions, gpxSegments): NodePosition[] => {
        const trackNodes = listAllNodesOfTracks(trackCompositions);
        const segmentIdsAfterNode = trackNodes.map((trackNode) => trackNode.segmentIdAfterNode);

        const nodePositions: NodePosition[] = [];

        segmentIdsAfterNode.forEach((segmentId) => {
            const foundSegment = gpxSegments.find((gpxSegment) => gpxSegment.id === segmentId);
            if (foundSegment) {
                const simpleGPX = SimpleGPX.fromString(foundSegment.content);
                const firstPointOfSegment = simpleGPX.tracks[0].points[0];
                nodePositions.push({
                    point: firstPointOfSegment,
                    tracks: getTrueTracks(segmentId, trackNodes, trackCompositions),
                });
            }
        });
        return nodePositions;
    }
);

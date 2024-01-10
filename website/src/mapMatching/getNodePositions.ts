import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { listAllNodesOfTracks } from '../logic/helper/nodeFinder.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';

export const getNodePositions = createSelector(
    getTrackCompositions,
    getGpxSegments,
    (trackCompositions, gpxSegments): { lat: number; lon: number }[] => {
        const segmentIdsBeforeNode = listAllNodesOfTracks(trackCompositions).flatMap((trackNode) =>
            trackNode.segmentsBeforeNode.map((tr) => tr.segmentId)
        );

        const nodePositions: { lat: number; lon: number }[] = [];

        segmentIdsBeforeNode.forEach((segmentId) => {
            const foundSegment = gpxSegments.find((gpxSegment) => gpxSegment.id === segmentId);
            if (foundSegment) {
                const simpleGPX = SimpleGPX.fromString(foundSegment.content);
                const lastTrackIndex = simpleGPX.tracks.length - 1;
                const lastPointOfSegment =
                    simpleGPX.tracks[lastTrackIndex].points[simpleGPX.tracks[lastTrackIndex].points.length - 1];
                nodePositions.push(lastPointOfSegment);
            }
        });
        return nodePositions;
    }
);

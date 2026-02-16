import { TrackStreetInfo } from '../types.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getNodePositions } from '../selectors/getNodePositions.ts';
import { CalculatedTrack } from '../../../../common/types.ts';
import { roundPublishedStartTimes } from '../../../../utils/dateUtil.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { getDistrictLookup, getPostCodeLookup, getStreetLookup } from '../../../store/segmentData.redux.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';

export const getTrackStreetInfos = createSelector(
    [
        getCalculatedTracks,
        getTrackCompositions,
        getStreetLookup,
        getDistrictLookup,
        getPostCodeLookup,
        getNodePositions,
    ],
    (calculatedTracks, tracks, streetLookup, districtLookup, postCodeLookup, nodePositions) => {
        return calculatedTracks.map((track: CalculatedTrack): TrackStreetInfo => {
            const trackComposition = tracks.find((trackComp) => trackComp.id === track.id);
            const distance = calculateDistanceInKm(track.points);

            const wayPoints = aggregateEnrichedPoints(
                track.points,
                track.peopleCount ?? 0,
                nodePositions,
                streetLookup,
                districtLookup,
                postCodeLookup
            );

            const startFront = wayPoints[0].frontArrival;
            const publicStart = trackComposition
                ? roundPublishedStartTimes(startFront, trackComposition.buffer ?? 0, trackComposition.rounding ?? 0)
                : startFront;

            return {
                id: track.id,
                name: track.filename,
                startFront: startFront,
                publicStart: publicStart,
                arrivalBack: wayPoints[wayPoints.length - 1].backArrival,
                arrivalFront: wayPoints[wayPoints.length - 1].frontPassage,
                distanceInKm: distance,
                peopleCount: track.peopleCount,
                wayPoints: wayPoints,
            };
        });
    }
);

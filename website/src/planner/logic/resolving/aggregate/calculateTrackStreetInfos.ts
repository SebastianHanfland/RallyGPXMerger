import { TrackStreetInfo } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { CalculatedTrack } from '../../../../common/types.ts';
import { roundPublishedStartTimes } from '../../../../utils/dateUtil.ts';
import { getParticipantsDelay, getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';
import { aggregatePoints } from './aggregatePoints.ts';
import { getLookups } from '../selectors/getLookups.ts';

export const getTrackStreetInfos = createSelector(
    [getCalculatedTracks, getTrackCompositions, getLookups, getParticipantsDelay],
    (calculatedTracks, tracks, lookups, participantsDelayInSeconds) => {
        const { streets, districts, postCodes } = lookups;
        return calculatedTracks.map((track: CalculatedTrack): TrackStreetInfo => {
            const trackComposition = tracks.find((trackComp) => trackComp.id === track.id);
            const distance = calculateDistanceInKm(track.points);

            const wayPoints = aggregatePoints(
                track.points,
                track.peopleCount ?? 0,
                participantsDelayInSeconds,
                streets,
                districts,
                postCodes
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

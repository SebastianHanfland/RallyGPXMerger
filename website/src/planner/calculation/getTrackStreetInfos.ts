import { createSelector } from '@reduxjs/toolkit';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getLookups } from '../logic/resolving/selectors/getLookups.ts';
import { getArrivalDateTime, getParticipantsDelay } from '../store/settings.reducer.ts';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import { getNodeSpecifications } from '../store/nodes.reducer.ts';
import { calculateTrackStreetInfos } from '../../common/calculation/track-info/calculateTrackStreetInfos.ts';
import { getCalculateTracks } from './getCalculatedTracks.ts';

export const getTrackStreetInfos = createSelector(
    [
        getParsedGpxSegments,
        getTrackCompositions,
        getLookups,
        getParticipantsDelay,
        getNodePositions,
        getArrivalDateTime,
        getCalculateTracks,
        getNodeSpecifications,
    ],
    calculateTrackStreetInfos
);

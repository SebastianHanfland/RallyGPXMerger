import { createSelector } from '@reduxjs/toolkit';
import { getParsedGpxSegments } from '../store/segmentData.redux';
import { getTrackCompositions } from '../store/trackMerge.reducer';
import { getLookups } from '../logic/resolving/selectors/getLookups';
import { getArrivalDateTime, getParticipantsDelay } from '../store/settings.reducer';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions';
import { getNodeSpecifications } from '../store/nodes.reducer';
import { calculateTrackStreetInfos } from '../../common/calculation/track-info/calculateTrackStreetInfos';
import { getCalculateTracks } from './getCalculatedTracks';
import { getAggregateStreetsInSegments } from '../../common/calculation/aggregated-segments/aggregatePointsSelector';

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
        getAggregateStreetsInSegments,
    ],
    calculateTrackStreetInfos
);

import { createSelector } from '@reduxjs/toolkit';
import {
    getDistrictLookup,
    getPostCodeLookup,
    getReplaceDistrictLookup,
    getReplacePostCodeLookup,
    getReplaceStreetLookup,
    getStreetLookup,
} from '../../../store/segmentData.redux.ts';

export interface Lookups {
    streets: Record<number, string | undefined>;
    postCodes: Record<number, string | undefined>;
    districts: Record<number, string | undefined>;
}

export const getCorrectStreetLookup = createSelector(
    [getStreetLookup, getReplaceStreetLookup],
    (streets, replaceStreets): Record<number, string | undefined> => {
        return { ...streets, ...replaceStreets };
    }
);

export const getLookups = createSelector(
    [
        getStreetLookup,
        getPostCodeLookup,
        getDistrictLookup,
        getReplaceStreetLookup,
        getReplacePostCodeLookup,
        getReplaceDistrictLookup,
    ],
    (streets, postCodes, districts, replaceStreets, replacePostCodes, replaceDistricts): Lookups => {
        return {
            streets: { ...streets, ...replaceStreets },
            postCodes: { ...postCodes, ...replacePostCodes },
            districts: { ...districts, ...replaceDistricts },
        };
    }
);

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
    streets: Record<number, string | null>;
    postCodes: Record<number, string | null>;
    districts: Record<number, string | null>;
}

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

import { createSelector } from '@reduxjs/toolkit';
import {
    getDistrictLookup,
    getPostCodeLookup,
    getReplaceDistrictLookup,
    getReplacePostCodeLookup,
    getReplaceStreetLookup,
    getStreetLookup,
} from '../../../store/segmentData.redux.ts';

export const getLookups = createSelector(
    [
        getStreetLookup,
        getPostCodeLookup,
        getDistrictLookup,
        getReplaceStreetLookup,
        getReplacePostCodeLookup,
        getReplaceDistrictLookup,
    ],
    (streets, postCodes, districts, replaceStreets, replacePostCodes, replaceDistricts) => {
        return {
            streets: { ...streets, ...replaceStreets },
            postCodes: { ...postCodes, ...replacePostCodes },
            districts: { ...districts, ...replaceDistricts },
        };
    }
);

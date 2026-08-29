import { createSelector } from '@reduxjs/toolkit';
import { getDistrictLookup, getPostCodeLookup, getStreetLookup } from '../../../store/segmentData.redux.ts';

export interface Lookups {
    streets: Record<number, string | undefined>;
    postCodes: Record<number, string | undefined>;
    districts: Record<number, string | undefined>;
}

export const getLookups = createSelector(
    [getStreetLookup, getPostCodeLookup, getDistrictLookup],
    (streets, postCodes, districts): Lookups => ({ streets, postCodes, districts })
);

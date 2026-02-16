import { ParsedGpxSegment, State } from '../../../store/types.ts';
import { getBigDataCloudKey } from '../../../store/geoCoding.reducer.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import {
    getDistrictLookup,
    getParsedGpxSegments,
    getPostCodeLookup,
    getStreetLookup,
} from '../../../store/segmentData.redux.ts';
import { fetchAndStorePostCodeAndDistrict } from '../postcode/postCodeResolver.ts';

function getPositionForKey(key: string, segments: ParsedGpxSegment[]): { lat: number; lon: number } | null {
    const segmentsWithStreetIndex = segments.filter((segment) => segment.points.find((point) => `${point.s}` === key));
    if (segmentsWithStreetIndex.length !== 1) {
        console.error('Expected only one segment to contain information here');
        return null;
    }
    const relevantSegment = segmentsWithStreetIndex[0];
    const pointsMatchingStreetIndex = relevantSegment.points.filter((point) => `${point.s}` === key);

    if (pointsMatchingStreetIndex.length === 0) {
        console.error(`No points found for key ${key}`);
        return null;
    }
    const lastPoint = pointsMatchingStreetIndex[pointsMatchingStreetIndex.length - 1];
    const firstPoint = pointsMatchingStreetIndex[0];

    return {
        lat: (firstPoint.b + lastPoint.b) / 2,
        lon: (firstPoint.l + lastPoint.l) / 2,
    };
}

export const enrichGpxSegmentsWithPostCodesAndDistricts = async (
    dispatch: AppDispatch,
    getState: () => State
): Promise<void> => {
    const streetLookup = getStreetLookup(getState());
    const districtLookup = getDistrictLookup(getState());
    const postCodeLookup = getPostCodeLookup(getState());
    const segments = getParsedGpxSegments(getState());
    const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
    if (!bigDataCloudKey) {
        return Promise.resolve();
    }

    const postCodeRequests: Promise<void>[] = Object.keys(streetLookup).map((key) => {
        if (postCodeLookup[Number(key)] && districtLookup[Number(key)]) {
            return Promise.resolve();
        }
        const positionForKey = getPositionForKey(key, segments);
        if (!positionForKey) {
            return Promise.resolve();
        }
        return fetchAndStorePostCodeAndDistrict(
            bigDataCloudKey,
            Number(key),
            dispatch,
            positionForKey.lat,
            positionForKey.lon
        );
    });

    return Promise.all(postCodeRequests).then();
};

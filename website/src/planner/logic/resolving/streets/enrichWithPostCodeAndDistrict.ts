import { ParsedGpxSegment, State } from '../../../store/types.ts';
import { getBigDataCloudKey } from '../../../store/geoCoding.reducer.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { getParsedGpxSegments, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { fetchAndStorePostCodeAndDistrict } from '../postcode/postCodeResolver.ts';
import { getLookups } from '../selectors/getLookups.ts';
import { getStreetLookupIndex } from '../helper/getStreetLookupIndex.ts';

function getPositionForKey(key: string, segments: ParsedGpxSegment[]): { lat: number; lon: number } | null {
    const pointsMatchingStreetIndex = segments.flatMap((segment) =>
        segment.points.filter((point) => `${getStreetLookupIndex(point)}` === key)
    );

    if (pointsMatchingStreetIndex.length === 0) {
        return null;
    }

    return {
        lat: pointsMatchingStreetIndex.reduce((total, point) => total + point.b, 0) / pointsMatchingStreetIndex.length,
        lon: pointsMatchingStreetIndex.reduce((total, point) => total + point.l, 0) / pointsMatchingStreetIndex.length,
    };
}

export const enrichStreetWithPostCodeAndDistrict =
    (streetIndex: number) =>
    async (dispatch: AppDispatch, getState: () => State): Promise<void> => {
        const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
        const position = getPositionForKey(`${streetIndex}`, getParsedGpxSegments(getState()));
        if (!position) {
            return;
        }

        const result = await fetchAndStorePostCodeAndDistrict(bigDataCloudKey, streetIndex, position.lat, position.lon);
        const postCodes: Record<number, string> = { [result.key]: result.postCode };
        const districts: Record<number, string> = {};
        if (result.district) {
            districts[result.key] = result.district;
        }
        dispatch(segmentDataActions.addPostCodeLookup(postCodes));
        dispatch(segmentDataActions.addDistrictLookup(districts));
    };

export const enrichGpxSegmentsWithPostCodesAndDistricts = async (
    dispatch: AppDispatch,
    getState: () => State
): Promise<void> => {
    const { streets, postCodes, districts } = getLookups(getState());
    const segments = getParsedGpxSegments(getState());
    const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
    if (!bigDataCloudKey) {
        return Promise.resolve();
    }

    const postCodeRequests: Promise<{ district: string | undefined; postCode: string; key: number } | undefined>[] =
        Object.keys(streets).map((key) => {
            if (postCodes[Number(key)] && districts[Number(key)]) {
                return Promise.resolve(undefined);
            }
            const positionForKey = getPositionForKey(key, segments);
            if (!positionForKey) {
                return Promise.resolve(undefined);
            }
            return fetchAndStorePostCodeAndDistrict(
                bigDataCloudKey,
                Number(key),
                positionForKey.lat,
                positionForKey.lon
            );
        });

    return Promise.all(postCodeRequests).then((results) => {
        const districts: Record<number, string> = {};
        const postCodes: Record<number, string> = {};
        results.forEach((result) => {
            if (result) {
                const { key, district, postCode } = result;
                if (district) {
                    districts[key] = district;
                }
                postCodes[key] = postCode;
            }
        });
        dispatch(segmentDataActions.addPostCodeLookup(postCodes));
        dispatch(segmentDataActions.addDistrictLookup(districts));
    });
};

import { State } from '../../../store/types.ts';
import { geoCodingActions, getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { gpxSegmentsActions } from '../../../store/gpxSegments.reducer.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { errorNotification } from '../../../store/toast.reducer.ts';
import { triggerAutomaticCalculation } from '../../automaticCalculation.ts';
import { Point } from '../../../../utils/gpxTypes.ts';
import { ParsedGpxSegment } from '../../../new-store/types.ts';
import { getStreetLookup, segmentDataActions } from '../../../new-store/segmentData.redux.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time,
            location: [point.lon, point.lat],
        })),
    };
}

const dateTimeInMillis = new Date('2025-06-01T10:11:55').getTime();

function getDateTimeStringWithOffset(offsetInSeconds: number) {
    return new Date(dateTimeInMillis + offsetInSeconds * 1000).toISOString();
}

function getPointsOfParsedPgxSegment(parsedSegment: ParsedGpxSegment): Point[] {
    return parsedSegment.points.map((point) => ({
        lat: point.b,
        lon: point.l,
        ele: point.e,
        time: getDateTimeStringWithOffset(point.t),
    }));
}

export const enrichGpxSegmentsWithStreetNames =
    (parsedSegments: ParsedGpxSegment[]) =>
    async (
        dispatch: AppDispatch,
        getState: () => State
    ): Promise<{ segments: ParsedGpxSegment[]; streetLookup: Record<number, string> }> => {
        const streetLookup = getStreetLookup(getState());
        const segmentIndexOffset = 5; // TODO calculate from highest key
        const geoApifyKey = getGeoApifyKey(getState()) || '9785fab54f7e463fa8f04543b4b9852b';
        const promises = parsedSegments.map((segment, segmentIndex) => {
            const points = getPointsOfParsedPgxSegment(segment);
            splitListIntoSections(points, 1000).flatMap((points) =>
                geoApifyFetchMapMatching(geoApifyKey)(toGeoApifyMapMatchingBody(points))
                    .then((resolvedPositions) => {
                        // New
                        dispatch(segmentDataActions.addGpxSegments(segments));
                        dispatch(segmentDataActions.addStreetLookup(streetLookup));
                        // Old
                    })
                    .catch((error) => errorNotification(dispatch, 'GeoApify Error', error.toString()))
            );
        });
        await Promise.all(promises);
        dispatch(triggerAutomaticCalculation);
        return { streetLookup: {}, segments: parsedSegments };
    };

import { ParsedGpxSegment, ParsedPoint, ResolvedPositions, State } from '../../../store/types.ts';
import { getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { errorNotification } from '../../../store/toast.reducer.ts';
import { triggerAutomaticCalculation } from '../../automaticCalculation.ts';
import { Point } from '../../../../utils/gpxTypes.ts';
import { getStreetLookup, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { enrichSegmentWithResolvedStreets } from './enrichSegmentWithResolvedStreets.ts';

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

const toPoint = (point: ParsedPoint): Point => ({
    lat: point.b,
    lon: point.l,
    ele: point.e,
    time: getDateTimeStringWithOffset(point.t),
});

export const enrichGpxSegmentsWithStreetNames =
    (parsedSegments: ParsedGpxSegment[]) =>
    async (dispatch: AppDispatch, getState: () => State): Promise<void> => {
        const streetLookup = getStreetLookup(getState());
        const lookupKeys = Object.keys(streetLookup);
        const maximumIndex = lookupKeys.length === 0 ? 1 : Math.max(...lookupKeys.map(Number));
        const segmentIndexOffset = Math.ceil(maximumIndex / 1000);

        const promises = parsedSegments.map((segment, segmentIndex) =>
            dispatch(enrichOneGpxSegment(segment, (segmentIndexOffset + segmentIndex) * 1000))
        );
        await Promise.all(promises);
        dispatch(triggerAutomaticCalculation);
        return Promise.resolve();
    };

function combineStreetNames(streetNames: ResolvedPositions[]): ResolvedPositions {
    const combinedStreetNames: ResolvedPositions = {};
    streetNames.forEach((streets) => {
        Object.entries(streets).forEach(([key, value]) => {
            combinedStreetNames[key] = value;
        });
    });
    return combinedStreetNames;
}

const enrichOneGpxSegment =
    (segmentWithoutStreets: ParsedGpxSegment, streetResolveStart: number) =>
    (dispatch: AppDispatch, getState: () => State): Promise<void> => {
        const geoApifyKey = getGeoApifyKey(getState()) || '9785fab54f7e463fa8f04543b4b9852b';
        const points = segmentWithoutStreets.points;

        const resolvedPositions = splitListIntoSections(points, 1000).flatMap((points) =>
            geoApifyFetchMapMatching(geoApifyKey)(toGeoApifyMapMatchingBody(points.map(toPoint))).catch((error) => {
                errorNotification(dispatch, 'GeoApify Error', error.toString());
                return {};
            })
        );
        return Promise.all(resolvedPositions).then((streetNames) => {
            const allResolvedStreetNames = combineStreetNames(streetNames);
            const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(
                segmentWithoutStreets,
                allResolvedStreetNames,
                streetResolveStart
            );
            dispatch(segmentDataActions.addGpxSegments([segment]));
            dispatch(segmentDataActions.addStreetLookup(streetLookUp));
        });
    };

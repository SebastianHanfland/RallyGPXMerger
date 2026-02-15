import { ParsedGpxSegment, ParsedPoint, ResolvedPositions, State } from '../../../store/types.ts';
import { getBigDataCloudKey, getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { errorNotification } from '../../../store/toast.reducer.ts';
import { triggerAutomaticCalculation } from '../../automaticCalculation.ts';
import { Point } from '../../../../utils/gpxTypes.ts';
import { getParsedGpxSegments, getStreetLookup, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { enrichSegmentWithResolvedStreets } from './enrichSegmentWithResolvedStreets.ts';

function getDateTimeStringWithOffset(offsetInSeconds: number) {
    return new Date(dateTimeInMillis + offsetInSeconds * 1000).toISOString();
}

const toPoint = (point: ParsedPoint): Point => ({
    lat: point.b,
    lon: point.l,
    ele: point.e,
    time: getDateTimeStringWithOffset(point.t),
});

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

export const enrichGpxSegmentsWithStreetNames = async (dispatch: AppDispatch, getState: () => State): Promise<void> => {
    const streetLookup = getStreetLookup(getState());
    const segments = getParsedGpxSegments(getState());

    // find streets without post code and district yet

    // iterate through the streetnames
    // find the start and end points of a street use
    // use them for setting the requests
    // store the result

    const lookupKeys = Object.keys(streetLookup).map((key) => {
        const positionForKey = getPositionForKey(key, segments);
        getBigDataCloudKey();
    });

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

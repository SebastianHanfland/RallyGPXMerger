import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { GeoCodingStateOld, GpxSegmentOld, GpxSegmentsStateOld } from '../planner/store/typesOld.ts';
import { ParsedGpxSegment, SegmentDataState } from '../planner/store/types.ts';
import { Point } from '../utils/gpxTypes.ts';
import { optionallyDecompress } from '../planner/store/compressHelper.ts';
import { enrichGpxSegmentsWithStreetNames } from './resolvingHelper.ts';
import { getWayPointKey, toKey } from '../planner/logic/resolving/helper/pointKeys.ts';

function gpxSegmentToParsedSegment(gpxSegment: GpxSegmentOld): ParsedGpxSegment {
    return {
        id: gpxSegment.id,
        streetsResolved: gpxSegment.streetsResolved ?? false,
        flipped: gpxSegment.flipped,
        filename: gpxSegment.filename,
        color: undefined,
        points: SimpleGPX.fromString(gpxSegment.content)
            .getPoints()
            .map((point) => ({ b: point.lat, l: point.lon, e: point.ele, t: -1, s: -1 })),
    };
}

function mapPoint(point: Point) {
    return { b: point.lat, l: point.lon, e: point.ele, t: -1, s: -1 };
}

function gpxSegmentToParsedSegmentAndResolve(gpxSegment: GpxSegmentOld): ParsedGpxSegment {
    const points = SimpleGPX.fromString(optionallyDecompress(gpxSegment.content))
        .getPoints()
        .map((point) => mapPoint(point));

    return {
        id: gpxSegment.id,
        streetsResolved: gpxSegment.streetsResolved ?? false,
        flipped: gpxSegment.flipped,
        filename: gpxSegment.filename,
        color: undefined,
        points: points,
    };
}

export function migrateToSegmentData(state: GpxSegmentsStateOld, geoCoding: GeoCodingStateOld): SegmentDataState {
    geoCoding.resolvedPositions;
    const postCodeLookup = {};
    const districtLookup = {};
    const parsedSegments = state.segments.map((segment) => gpxSegmentToParsedSegmentAndResolve(segment));

    const { segments, streetLookUp } = enrichGpxSegmentsWithStreetNames(parsedSegments, geoCoding);

    return {
        segmentSpeeds: state.segmentSpeeds ?? {},
        segments: segments,
        pois: [],
        clickOnSegment: state.clickOnSegment,
        constructionSegments: state.constructionSegments?.map((segment) => gpxSegmentToParsedSegment(segment)) ?? [],
        replaceProcess: undefined,
        streetLookup: streetLookUp,
        postCodeLookup: postCodeLookup,
        districtLookup: districtLookup,
        segmentFilterTerm: state.segmentFilterTerm,
    };
}

// const positionKey = toKey(point);
// let streetName: string | null = null;
// if (geoCoding.resolvedPositions) {
//     streetName = geoCoding.resolvedPositions[positionKey];
// }
// let district: string | null = null;
// let postCode: string | null = null;
// geoCoding.trackStreetInfos?.forEach((trackInfo) => {
//     const foundWayPoint = trackInfo.wayPoints.find(
//         (wayPoint) =>
//             wayPoint.streetName === streetName &&
//             wayPoint.pointFrom.lat === point.lat &&
//             wayPoint.pointFrom.lon === point.lon
//     );
//     if (foundWayPoint && geoCoding.resolvedPostCodes && geoCoding.resolvedDistricts) {
//         const postCodeKey = getWayPointKey(foundWayPoint).postCodeKey;
//         const foundPostCode = geoCoding.resolvedPostCodes[postCodeKey];
//         district = geoCoding.resolvedDistricts[postCodeKey];
//         postCode = foundPostCode ? `${foundPostCode}` : null;
//         console.log('found waypoint');
//     }
// });
// console.log({ streetName, district, postCode });

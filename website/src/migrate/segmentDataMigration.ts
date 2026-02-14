import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { GeoCodingStateOld, GpxSegmentOld, GpxSegmentsStateOld } from '../planner/store/typesOld.ts';
import { ParsedGpxSegment, SegmentDataState } from '../planner/store/types.ts';
import { Point } from '../utils/gpxTypes.ts';
import { toKey } from '../planner/logic/resolving/helper/pointKeys.ts';
import { optionallyDecompress } from '../planner/store/compressHelper.ts';

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

function mapPoint(
    point: Point,
    streetLookup: Record<number, string | null>,
    postCodeLookup: Record<number, string | null>,
    districtLookup: Record<number, string | null>,
    geoCoding: GeoCodingStateOld
) {
    const positionKey = toKey(point);
    let streetName = null;
    if (geoCoding.resolvedPositions) {
        streetName = geoCoding.resolvedPositions[positionKey];
    }
    console.log({ streetName });
    return { b: point.lat, l: point.lon, e: point.ele, t: -1, s: -1 };
}

function gpxSegmentToParsedSegmentAndResolve(
    gpxSegment: GpxSegmentOld,
    streetLookup: Record<number, string | null>,
    postCodeLookup: Record<number, string | null>,
    districtLookup: Record<number, string | null>,
    geoCoding: GeoCodingStateOld
): ParsedGpxSegment {
    console.log(optionallyDecompress(gpxSegment.content));
    return {
        id: gpxSegment.id,
        streetsResolved: gpxSegment.streetsResolved ?? false,
        flipped: gpxSegment.flipped,
        filename: gpxSegment.filename,
        color: undefined,
        points: SimpleGPX.fromString(optionallyDecompress(gpxSegment.content))
            .getPoints()
            .map((point) => mapPoint(point, streetLookup, postCodeLookup, districtLookup, geoCoding)),
    };
}

export function migrateToSegmentData(state: GpxSegmentsStateOld, geoCoding: GeoCodingStateOld): SegmentDataState {
    geoCoding.resolvedPositions;
    const streetLookup = {};
    const postCodeLookup = {};
    const districtLookup = {};
    return {
        segmentSpeeds: state.segmentSpeeds ?? {},
        segments: state.segments.map((segment) =>
            gpxSegmentToParsedSegmentAndResolve(segment, streetLookup, postCodeLookup, districtLookup, geoCoding)
        ),
        pois: [],
        clickOnSegment: state.clickOnSegment,
        constructionSegments: state.constructionSegments?.map((segment) => gpxSegmentToParsedSegment(segment)) ?? [],
        replaceProcess: undefined,
        streetLookup: {},
        postCodeLookup: {},
        districtLookup: {},
        segmentFilterTerm: state.segmentFilterTerm,
    };
}

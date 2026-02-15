import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { GeoCodingStateOld, GpxSegmentOld, GpxSegmentsStateOld } from '../planner/store/typesOld.ts';
import { ParsedGpxSegment, SegmentDataState } from '../planner/store/types.ts';
import { Point } from '../utils/gpxTypes.ts';
import { optionallyDecompress } from '../planner/store/compressHelper.ts';
import { enrichGpxSegmentsWithStreetNames } from './streetNameResolvingHelper.ts';
import { createPostCodeAndDistrictLookups } from './postCodeAndDistrictResolvingHelper.ts';
import { setTimingsForSegments } from './segmentTimingResolver.ts';

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

export function migrateToSegmentData(
    state: GpxSegmentsStateOld,
    geoCoding: GeoCodingStateOld,
    averageSpeed: number
): SegmentDataState {
    const parsedSegments = state.segments.map((segment) => gpxSegmentToParsedSegmentAndResolve(segment));

    const { segments, streetLookUp } = enrichGpxSegmentsWithStreetNames(parsedSegments, geoCoding);
    const { postCodeLookup, districtLookup } = createPostCodeAndDistrictLookups(segments, geoCoding, streetLookUp);
    const segmentsWithTiming = setTimingsForSegments(segments, state.segmentSpeeds, averageSpeed);

    return {
        segmentSpeeds: state.segmentSpeeds ?? {},
        segments: segmentsWithTiming,
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

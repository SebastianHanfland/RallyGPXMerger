import { SimpleGPX } from '../utils/SimpleGPX';
import { GeoCodingStateOld, GpxSegmentOld, GpxSegmentsStateOld } from '../planner/store/typesOld';
import { ParsedGpxSegment, SegmentDataState } from '../planner/store/types';
import { Point } from '../utils/gpxTypes';
import { optionallyDecompress } from '../planner/store/compressHelper';
import { enrichGpxSegmentsWithStreetNames } from './streetNameResolvingHelper';
import { createPostCodeAndDistrictLookups } from './postCodeAndDistrictResolvingHelper';
import { setTimingsForSegments } from './segmentTimingResolver';

function gpxSegmentToParsedSegment(gpxSegment: GpxSegmentOld): ParsedGpxSegment {
    return {
        id: gpxSegment.id,
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
        flipped: gpxSegment.flipped,
        filename: gpxSegment.filename,
        color: undefined,
        points: gpxSegment.flipped ? points.reverse() : points,
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
        clickOnSegment: state.clickOnSegment,
        constructionSegments: state.constructionSegments?.map((segment) => gpxSegmentToParsedSegment(segment)) ?? [],
        replaceProcess: undefined,
        streetLookup: streetLookUp,
        postCodeLookup: postCodeLookup,
        districtLookup: districtLookup,
        segmentFilterTerm: state.segmentFilterTerm,
    };
}

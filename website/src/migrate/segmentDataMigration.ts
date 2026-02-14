import { ParsedGpxSegment, SegmentDataState } from '../planner/new-store/types.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { GpxSegmentOld, GpxSegmentsStateOld } from '../planner/store/typesOld.ts';

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

export function migrateToSegmentData(state: GpxSegmentsStateOld): SegmentDataState {
    return {
        segmentSpeeds: state.segmentSpeeds ?? {},
        segments: state.segments.map(gpxSegmentToParsedSegment),
        pois: [],
        clickOnSegment: state.clickOnSegment,
        constructionSegments: state.constructionSegments?.map(gpxSegmentToParsedSegment) ?? [],
        replaceProcess: state.replaceProcess
            ? {
                  targetSegment: state.replaceProcess?.targetSegment,
                  replacementSegments: state.replaceProcess?.replacementSegments?.map(gpxSegmentToParsedSegment),
              }
            : undefined,
        streetLookup: {},
        postCodeLookup: {},
        districtLookup: {},
        segmentFilterTerm: state.segmentFilterTerm,
    };
}

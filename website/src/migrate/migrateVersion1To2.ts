import { GpxSegmentsState, State } from '../planner/store/types.ts';
import { StateOld } from '../planner/store/typesOld.ts';
import { GpxSegment } from '../common/types.ts';
import { ParsedGpxSegment, SegmentDataState } from '../planner/new-store/types.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';

type StateVersion1 = StateOld;
type StateVersion2 = State;

export const isOldState = (state: State | StateOld): state is StateOld => {
    return (state as StateOld).gpxSegments !== undefined;
};

function gpxSegmentToParsedSegment(gpxSegment: GpxSegment): ParsedGpxSegment {
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

function migrateToSegmentData(state: GpxSegmentsState): SegmentDataState {
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
        segmentFilterTerm: state.segmentFilterTerm,
    };
}

export function migrateVersion1To2(stateVersion1: StateVersion1): StateVersion2 {
    return {
        segmentData: migrateToSegmentData(stateVersion1.gpxSegments),
        layout: stateVersion1.layout,
        map: stateVersion1.map,
        trackMerge: stateVersion1.trackMerge,
        backend: stateVersion1.backend,
        points: stateVersion1.points,
        geoCoding: stateVersion1.geoCoding,
    };
}

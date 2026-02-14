import { GpxSegmentsState, State } from '../store/types.ts';
import { StateOld } from '../store/typesOld.ts';
import { ParsedGpxSegment, SegmentDataState } from '../new-store/types.ts';
import { GpxSegment } from '../../common/types.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';

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

export function migrateState(state: StateOld): State {
    return {
        segmentData: migrateToSegmentData(state.gpxSegments),
        layout: state.layout,
        map: state.map,
        trackMerge: state.trackMerge,
        calculatedTracks: state.calculatedTracks,
        backend: state.backend,
        points: state.points,
        geoCoding: state.geoCoding,
    };
}

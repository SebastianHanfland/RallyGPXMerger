import { TrackCompositionOld, TrackMergeStateOld } from '../planner/store/typesOld.ts';
import { BREAK, SEGMENT, TrackBreak, TrackComposition, TrackMergeState, TrackSegment } from '../planner/store/types.ts';
import { v4 as uuidv4 } from 'uuid';

export const BREAK_IDENTIFIER = '%%min-%%';

function convertTrackCompositions(trackCompositionsOld: TrackCompositionOld[]): TrackComposition[] {
    return trackCompositionsOld.map((track) => ({
        id: track.id,
        name: track.name,
        peopleCount: track.peopleCount,
        buffer: track.buffer,
        priority: track.priority,
        delayAtEndInSeconds: undefined,
        rounding: track.rounding,
        segments: track.segmentIds.map((segmentId): TrackBreak | TrackSegment => {
            if (segmentId.includes(BREAK_IDENTIFIER)) {
                const minutes = segmentId.split(BREAK_IDENTIFIER)[0];
                return { type: BREAK, id: uuidv4(), minutes: Number(minutes), hasToilet: false, description: '' };
            }
            return { type: SEGMENT, id: segmentId, segmentId: segmentId };
        }),
    }));
}

export function migrateTrackMerge(trackMerge: TrackMergeStateOld): TrackMergeState {
    return {
        trackCompositions: convertTrackCompositions(trackMerge.trackCompositions),
        filterTerm: trackMerge.filterTerm,
        segmentIdClipboard: undefined,
        trackIdForAddingABreak: trackMerge.trackIdForAddingABreak,
    };
}

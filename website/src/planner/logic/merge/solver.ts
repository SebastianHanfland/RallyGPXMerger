import { getAdjustedArrivalDateTime } from './helper/peopleDelayCounter.ts';

import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { TrackComposition } from '../../store/types.ts';
import { CalculatedTrack, ResolvedGpxSegment } from '../../../common/types.ts';
import { ParsedGpxSegment } from '../../new-store/types.ts';

/*
We have to find nodes where the branches join
* Seeing that some segments are used by multiple tracks
We have to pick one of the track which arrives delayed/earlier at this node to prevent a jam

A longer branch goes first and the smaller ones add at the end of it

Also don't forget that duplicating a SimpleGPX is probably more complicated than duplicating a string
 */

export interface GpxMergeLogic {
    (
        gpxSegments: ParsedGpxSegment[],
        trackCompositions: TrackComposition[],
        arrivalDateTime: string
    ): CalculatedTrack[];
}

function isNotNull<T>(arg: T | null): arg is T {
    return arg !== null;
}

export const mergeAndDelayAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime: string) => {
    return trackCompositions
        .map((track) => {
            const endDate = getAdjustedArrivalDateTime(arrivalDateTime, track, trackCompositions);
            return assembleTrackFromSegments(track, gpxSegments, endDate);
        })
        .filter(isNotNull);
};

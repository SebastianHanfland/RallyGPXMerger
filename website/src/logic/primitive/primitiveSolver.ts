import { Break, GpxMergeLogic, instanceOfBreak } from '../types.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { resolveGpxSegments } from '../helper/solvingHelper.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../store/types.ts';

export const mergeAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        return assembleTrackFromSegments(track, gpxSegments, arrivalDateTime);
    });
};

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: GpxSegment[],
    initialEndDate: string
): CalculatedTrack {
    let arrivalTimeForPreviousSegment = initialEndDate;
    let shiftedGpxContents: SimpleGPX[] = [];

    const gpxSegmentContents: (SimpleGPX | Break)[] = resolveGpxSegments(track, gpxSegments);
    gpxSegmentContents.reverse().forEach((gpxOrBreak) => {
        if (!instanceOfBreak(gpxOrBreak)) {
            gpxOrBreak.shiftToArrivalTime(arrivalTimeForPreviousSegment);
            arrivalTimeForPreviousSegment = gpxOrBreak.getStart();
            shiftedGpxContents = [gpxOrBreak, ...shiftedGpxContents];
        } else {
            arrivalTimeForPreviousSegment = shiftEndDate(arrivalTimeForPreviousSegment, gpxOrBreak.minutes);
        }
    });

    const trackContent = mergeSimpleGPXs(shiftedGpxContents).toString();

    return { id: track.id, content: trackContent, filename: track.name! };
}

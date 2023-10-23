import { CalculatedTrack, GpxSegment, TrackComposition } from '../../store/types.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';
import { Break, instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from '../helper/solvingHelper.ts';
import { shiftEndDate } from '../shiftEndDate.ts';

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
import { Break, GpxMergeLogic, instanceOfBreak } from '../types.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { resolveGpxSegments } from '../helper/solvingHelper.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';

export const mergeAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        const gpxSegmentContents: (SimpleGPX | Break)[] = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: SimpleGPX[] = [];
        let endDate: string = arrivalDateTime;

        gpxSegmentContents.reverse().forEach((gpxOrBreak) => {
            if (!instanceOfBreak(gpxOrBreak)) {
                // adjust this GPX to its intended arrival time
                gpxOrBreak.shiftToArrivalTime(endDate);
                endDate = gpxOrBreak.getStart();
                shiftedGpxContents = [gpxOrBreak, ...shiftedGpxContents];
            } else {
                // make the next group arrive a bit early
                endDate = shiftEndDate(endDate, gpxOrBreak.minutes);
            }
        });

        const trackContent = mergeSimpleGPXs(shiftedGpxContents).toString();

        return { id: track.id, content: trackContent, filename: track.name! };
    });
};

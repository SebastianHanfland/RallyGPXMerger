import { Break, GpxMergeLogic, instanceOfBreak } from '../types.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { resolveGpxSegments } from '../helper/solvingHelper.ts';
import { listAllNodesOfTracks } from './nodeFinder.ts';
import { getAdjustedArrivalDateTime } from './peopleDelayCounter.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';

/*
We have to find nodes where the branches join
* Seeing that some segments are used by multiple tracks
We have to pick one of the track which arrives delayed/earlier at this node to prevent a jam

A longer branch goes first and the smaller ones add at the end of it

Also don't forget that duplicating a SimpleGPX is probably more complicated than duplicating a string
 */

export const mergeAndDelayAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime: string) => {
    const trackNodes = listAllNodesOfTracks(trackCompositions, gpxSegments);

    return trackCompositions.map((track) => {
        const gpxSegmentContents: (SimpleGPX | Break)[] = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: SimpleGPX[] = [];
        let endDate = getAdjustedArrivalDateTime(arrivalDateTime, track, trackNodes);

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

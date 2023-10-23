import { GpxMergeLogic, Break, instanceOfBreak } from '../types.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { mergeGpxSegmentContents, resolveGpxSegments } from '../helper/solvingHelper.ts';
import { listAllNodesOfTracks } from './nodeFinder.ts';
import { getAdjustedArrivalDateTime } from './peopleDelayCounter.ts';
import { SimpleGPX } from '../SimpleGPX.ts';

/*
We have to find nodes where the branches join
* Seeing that some segments are used by multiple tracks
We have to pick one of the track which arrives delayed/earlier at this node to prevent a jam

A longer branch goes first and the smaller ones add at the end of it

Also don't forget that duplicating a SimpleGPX is probably more complicated than duplicating a string
 */

export const mergeAndDelayAndAdjustTimes: GpxMergeLogic = (
    gpxSegments,
    trackCompositions,
    arrivalDateTime: String | Date
) => {
    const trackNodes = listAllNodesOfTracks(trackCompositions, gpxSegments);

    return trackCompositions.map((track) => {
        const gpxSegmentContents: (SimpleGPX | Break)[] = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: SimpleGPX[] = [];
        let endDate = getAdjustedArrivalDateTime(new Date(arrivalDateTime.toString()), track, trackNodes);

        gpxSegmentContents.reverse().forEach((content) => {
            if (!instanceOfBreak(content)) {
                // adjust this GPX to its intended arrival time
                content.shiftToArrivalTime(endDate);
                endDate = content.start;
                shiftedGpxContents = [content, ...shiftedGpxContents];
            } else {
                // make the next group arrive a bit early
                endDate = shiftEndDate(endDate, content.minutes);
            }
        });

        const trackContent = mergeGpxSegmentContents(shiftedGpxContents);

        return { id: track.id, content: trackContent, filename: track.name! };
    });
};

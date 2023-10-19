import { GpxMergeLogic } from '../types.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../startTimeExtractor.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { mergeGpxSegmentContents, resolveGpxSegments } from '../helper/solvingHelper.ts';
import { listAllNodesOfTracks } from './nodeFinder.ts';
import { getAdjustedArrivalDateTime } from './peopleDelayCounter.ts';

/*
We have to find nodes where the branches join
* Seeing that some segments are used by multiple tracks
We have to pick one of the track which arrives delayed/earlier at this node to prevent a jam

A longer branch goes first and the smaller ones add at the end of it
 */

export const mergeAndDelayAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    const trackNodes = listAllNodesOfTracks(trackCompositions, gpxSegments);

    return trackCompositions.map((track) => {
        const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: string[] = [];
        let endDate = getAdjustedArrivalDateTime(arrivalDateTime, track, trackNodes);

        gpxSegmentContents.reverse().forEach((content) => {
            if (typeof content === 'string') {
                const shiftedContent = letTimeInGpxEndAt(content, endDate);
                endDate = getStartTimeOfGpxTrack(shiftedContent);
                shiftedGpxContents = [shiftedContent, ...shiftedGpxContents];
            } else {
                endDate = shiftEndDate(endDate, content.minutes);
            }
        });

        const trackContent = mergeGpxSegmentContents(shiftedGpxContents);

        return { id: track.id, content: trackContent, filename: track.name! };
    });
};

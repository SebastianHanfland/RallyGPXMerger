import { GpxMergeLogic } from '../types.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../startTimeExtractor.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { mergeGpxSegmentContents, resolveGpxSegments } from '../helper/solvingHelper.ts';

const DELAY_PER_PERSON_IN_SECONDS = 0.2;

console.log(DELAY_PER_PERSON_IN_SECONDS);

/*
We have to find nodes where the branches join
* Seeing that some segments are used by multiple tracks
We have to pick one of the track which arrives delayed/earlier at this node to prevent a jam

A longer branch goes first and the smaller ones add at the end of it
 */

export const mergeAndDelayAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: string[] = [];
        let endDate = arrivalDateTime;

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

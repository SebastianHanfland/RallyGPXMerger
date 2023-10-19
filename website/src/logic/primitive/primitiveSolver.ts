import { GpxMergeLogic } from '../types.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../startTimeExtractor.ts';
import { shiftEndDate } from '../shiftEndDate.ts';
import { mergeGpxSegmentContents, resolveGpxSegments } from '../helper/solvingHelper.ts';

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
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

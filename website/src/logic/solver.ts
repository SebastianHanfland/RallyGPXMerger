import { GpxMergeLogic } from './types.ts';
import { listAllNodesOfTracks } from './helper/nodeFinder.ts';
import { getAdjustedArrivalDateTime } from './helper/peopleDelayCounter.ts';

import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';

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
        const endDate = getAdjustedArrivalDateTime(arrivalDateTime, track, trackNodes, trackCompositions);
        return assembleTrackFromSegments(track, gpxSegments, endDate);
    });
};

import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { getDelaysOfTracks } from './getSpecifiedDelayPerTrack.ts';

export function getExtraDelayOnTrack(
    track: TrackComposition,
    trackCompositions: TrackComposition[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): number {
    const delaysOfTracks = getDelaysOfTracks(trackCompositions, participantsDelayInSeconds, nodeSpecifications);
    console.log({ delaysOfTracks });
    const delaysOfTrack = delaysOfTracks.find((delays) => delays.trackId === track.id);
    if (!delaysOfTrack) {
        return 0;
    }
    let countDelay = 0;
    delaysOfTrack.delays.forEach((delay) => {
        countDelay += delay.extraDelay;
    });
    return -countDelay;
}

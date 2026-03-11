import { BREAK, NODE, NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { getDelaysOfTracks } from './getSpecifiedDelayPerTrack.ts';

export function getExtraDelayOnTrack(
    track: TrackComposition,
    trackCompositions: TrackComposition[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): number {
    const delaysOfTracks = getDelaysOfTracks(trackCompositions, participantsDelayInSeconds, nodeSpecifications);
    const delaysOfTrack = delaysOfTracks.find((delays) => delays.trackId === track.id);
    if (!delaysOfTrack) {
        return 0;
    }
    let countDelay = 0;
    delaysOfTrack.delays
        // ignore not yet calculated Nodes
        .filter((delay) => delay.by !== NODE)
        .forEach((delay) => {
            // Breaks do not do a shift at the end
            if (delay.by !== BREAK) {
                countDelay += delay.extraDelay;
            }
        });
    return -countDelay;
}

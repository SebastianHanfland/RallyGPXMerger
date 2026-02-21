import { getExtraDelayOnTrack } from './peopleDelayCounter.ts';
import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';

export const updateExtraDelayOnTracks = (
    trackCompositions: TrackComposition[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): TrackComposition[] => {
    return trackCompositions.map((track) => ({
        ...track,
        delayAtEndInSeconds: getExtraDelayOnTrack(
            track,
            trackCompositions,
            participantsDelayInSeconds,
            nodeSpecifications
        ),
    }));
};

import { getExtraDelayOnTrack } from './peopleDelayCounter';
import { NodeSpecifications, TrackComposition } from '../../../planner/store/types';

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

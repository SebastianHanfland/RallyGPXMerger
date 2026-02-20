import { getExtraDelayOnTrack } from './helper/peopleDelayCounter.ts';
import { NodeSpecifications, TrackComposition } from '../../store/types.ts';

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

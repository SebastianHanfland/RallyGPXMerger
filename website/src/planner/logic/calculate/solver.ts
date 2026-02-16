import { getExtraDelayOnTrack } from './helper/peopleDelayCounter.ts';
import { TrackComposition } from '../../store/types.ts';

export const updateExtraDelayOnTracks = (
    trackCompositions: TrackComposition[],
    participantsDelayInSeconds: number
): TrackComposition[] => {
    return trackCompositions.map((track) => ({
        ...track,
        delayAtEndInSeconds: getExtraDelayOnTrack(track, trackCompositions, participantsDelayInSeconds),
    }));
};

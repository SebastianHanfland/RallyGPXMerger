import { getExtraDelayOnTrack } from './helper/peopleDelayCounter.ts';
import { TrackComposition } from '../../store/types.ts';

export const updateExtraDelayOnTracks = (trackCompositions: TrackComposition[]): TrackComposition[] => {
    return trackCompositions.map((track) => ({
        ...track,
        delayAtEndInSeconds: getExtraDelayOnTrack(track, trackCompositions),
    }));
};

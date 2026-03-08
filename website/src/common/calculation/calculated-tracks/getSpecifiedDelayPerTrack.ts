import { BREAK, NODE, NodeSpecifications, PEOPLE, PRIORITY, TrackComposition } from '../../../planner/store/types.ts';

export interface TrackDelay {
    segmentId: string;
    extraDelay: number;
    by: typeof BREAK | typeof NODE | typeof PRIORITY | typeof PEOPLE;
}

export const getSpecifiedDelayPerTrack = () => {
    const segemtIdAfterNode = '123';
    const involvedTracks: TrackComposition[] = [];

    // for each track involved
    involvedTracks.map(() => {
        return {
            trackId: '1',
            delaysBeforeSegments: [
                { segmentId: '23', extraDelay: 20, by: NODE },
                { segmentId: '23', extraDelay: 20, by: BREAK },
                { segmentId: '12', extraDelay: 20, by: NODE },
                { segmentId: '12', extraDelay: 20, by: PRIORITY },
                { segmentId: '12', extraDelay: 20, by: PEOPLE },
            ],
        };
    });
    // summing up delay for extra delay -> Calculation done
    // for displaying and UI purpose
};

export const getDelaysOfTrack = (
    track: TrackComposition,
    tracks: TrackComposition[],
    delayPerPerson: number,
    nodeSpecifications: NodeSpecifications | undefined
): TrackDelay[] => {
    return [];
};

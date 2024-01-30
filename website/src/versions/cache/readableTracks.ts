import { ReadableTrack } from '../../common/types.ts';

let readableTracks: ReadableTrack[] | undefined = undefined;

export const getReadableTracks = () => readableTracks;
export const extendReadableTracks = (newReadableTracks: ReadableTrack[]) => {
    if (readableTracks === undefined) {
        readableTracks = newReadableTracks;
    } else {
        readableTracks = [...readableTracks, ...newReadableTracks];
    }
};

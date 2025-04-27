import { ReadableTrack } from '../../common/types.ts';

let readableTracks: ReadableTrack[] | undefined = undefined;

export const clearReadableTracks = () => {
    readableTracks = undefined;
};

// TODO-187: resolve readable tracks also in planner
export const getReadableTracks = () => readableTracks;
export const setReadableTracks = (newReadableTracks: ReadableTrack[]) => {
    readableTracks = newReadableTracks;
};

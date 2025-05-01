import { ReadableTrack } from '../../common/types.ts';

let readableTracks: ReadableTrack[] | undefined = undefined;

// TODO-187: resolve readable tracks also in planner
export const getReadableTracks = () => readableTracks;

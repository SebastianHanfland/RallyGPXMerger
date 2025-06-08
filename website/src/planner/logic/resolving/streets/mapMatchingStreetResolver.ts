import { State } from '../../../store/types.ts';
import { AppDispatch } from '../../../store/planningStore.ts';

export async function resolveStreetNames(dispatch: AppDispatch, getState: () => State) {
    // TODO 223: resolve similar to when uploading gpx files
    console.log(dispatch, getState);
}

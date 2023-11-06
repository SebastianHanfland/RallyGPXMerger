import { ResolvePositions } from '../store/types.ts';
import { getReadableTracks } from '../logic/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';

export function toKey({ lat, lon }: { lat: number; lon: number }): string {
    return `lat:${lat.toFixed(10)}-lng:${lon.toFixed(10)}`;
}

export const initializeResolvedPositions = (dispatch: AppDispatch) => {
    const positionMap: ResolvePositions = {};
    getReadableTracks()?.forEach((gpx) => {
        gpx.tracks.forEach((track) => {
            track.points.forEach((point) => {
                positionMap[toKey(point)] = null;
            });
        });
    });

    dispatch(geoCodingActions.saveResolvedPositions(positionMap));
};

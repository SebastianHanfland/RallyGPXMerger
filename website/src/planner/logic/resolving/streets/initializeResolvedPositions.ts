import { ResolvedPositions } from '../../../store/types.ts';
import { AppDispatch } from '../../../store/store.ts';
import { geoCodingActions } from '../../../store/geoCoding.reducer.ts';
import { toKey } from '../helper/pointKeys.ts';
import { getReadableTracks } from '../../../cache/readableTracks.ts';

export const initializeResolvedPositions = (dispatch: AppDispatch) => {
    const positionMap: ResolvedPositions = {};
    getReadableTracks()?.forEach((readableTrack) => {
        readableTrack.gpx.tracks.forEach((track) => {
            track.points.forEach((point) => {
                positionMap[toKey(point)] = null;
            });
        });
    });

    dispatch(geoCodingActions.saveResolvedPositions(positionMap));
};

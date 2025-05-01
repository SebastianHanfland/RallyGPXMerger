import { ResolvedPositions } from '../../../store/types.ts';
import { AppDispatch } from '../../../store/planningStore.ts';
import { geoCodingActions } from '../../../store/geoCoding.reducer.ts';
import { toKey } from '../helper/pointKeys.ts';
import { Point } from '../../../../utils/gpxTypes.ts';
import { ParsedTrack } from '../../../../common/types.ts';

export const initializeResolvedPositions = (parsedTracks: ParsedTrack[]) => (dispatch: AppDispatch) => {
    const positionMap: ResolvedPositions = {};
    parsedTracks.forEach((track) => {
        track.points.forEach((point: Point) => {
            positionMap[toKey(point)] = null;
        });
    });

    dispatch(geoCodingActions.saveResolvedPositions(positionMap));
};

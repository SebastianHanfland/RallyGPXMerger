import { Dispatch } from '@reduxjs/toolkit';
import { DisplayTrack } from '../../common/types.ts';
import { State } from '../../planner/store/types.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { getPlanningLabel, getPlanningTitle } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { displayTracksActions } from '../store/displayTracksReducer.ts';
import { getBlockedStreetInfo } from '../../planner/logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getTrackStreetInfos } from '../../planner/logic/resolving/aggregate/calculateTrackStreetInfosWithBreaksAndNodes.ts';
import { getCalculatedTracks } from '../../planner/store/calculatedTracks.reducer.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            dispatch(displayTracksActions.setTitle(planningTitle));
            dispatch(displayTracksActions.setEnrichedTrackStreetInfos(getTrackStreetInfos(planning)));
            dispatch(displayTracksActions.setBlockStreetInfos(getBlockedStreetInfo(planning)));
            dispatch(displayTracksActions.setPlanningLabel(getPlanningLabel(planning)));

            const calculatedTracks: DisplayTrack[] = getCalculatedTracks(planning).map((track) => ({
                peopleCount: track.peopleCount,
                filename: track.filename,
                id: track.id,
                version: id,
                color: getColor(track),
                points: track.points,
            }));
            dispatch(displayTracksActions.setDisplayTracks(calculatedTracks));
        })
        .catch(console.error)
        .finally();
}

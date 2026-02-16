import { Dispatch } from '@reduxjs/toolkit';
import { DisplayTrack } from '../../common/types.ts';
import { State } from '../../planner/store/types.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { getPlanningLabel, getPlanningTitle } from '../../planner/store/trackMerge.reducer.ts';
import { getBackupData, getData } from '../../api/api.ts';
import { displayTracksActions } from '../store/displayTracksReducer.ts';
import { getBlockedStreetInfo } from '../../planner/logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getTrackStreetInfos } from '../../planner/logic/resolving/aggregate/calculateTrackStreetInfos.ts';

export async function loadServerFile(id: string, dispatch: Dispatch, isBackup: boolean = false) {
    return (isBackup ? getBackupData() : getData(id).then((res) => res.data))
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            dispatch(displayTracksActions.setTitle(planningTitle));
            dispatch(displayTracksActions.setEnrichedTrackStreetInfos(getTrackStreetInfos(planning)));
            dispatch(displayTracksActions.setBlockStreetInfos(getBlockedStreetInfo(planning)));
            dispatch(displayTracksActions.setPlanningLabel(getPlanningLabel(planning)));

            const calculatedTracks: DisplayTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                peopleCount: track.peopleCount,
                filename: track.filename,
                id: track.id,
                version: id,
                color: getColorFromUuid(track.id),
                points: track.points,
            }));
            dispatch(displayTracksActions.setDisplayTracks(calculatedTracks));
        })
        .catch(console.error)
        .finally();
}

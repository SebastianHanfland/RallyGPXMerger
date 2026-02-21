import { Dispatch } from '@reduxjs/toolkit';
import { comparisonActions } from '../store/tracks.reducer.ts';
import { State } from '../../planner/store/types.ts';
import { getTrackCompositions } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { mapActions } from '../store/map.reducer.ts';
import { getStartAndEndPlanning } from '../../utils/parsedTracksUtil.ts';
import { getParticipantsDelay, getPlanningTitle } from '../../planner/store/settings.reducer.ts';
import { getCalculateTracks } from '../../planner/calculation/getCalculatedTracks.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            const calculatedTracks = getCalculateTracks(planning);
            const tracks = getTrackCompositions(planning);
            const delay = getParticipantsDelay(planning);

            dispatch(
                mapActions.setStartAndEndTime({
                    ...getStartAndEndPlanning(calculatedTracks, tracks, delay),
                    planningId: id,
                })
            );
            dispatch(comparisonActions.setComparisonParsedTracks({ version: id, tracks: calculatedTracks }));
            dispatch(comparisonActions.setDisplayInformation({ version: id, versionTitle: planningTitle }));
            dispatch(comparisonActions.setSelectVersions([id]));
        })
        .catch(console.error)
        .finally();
}

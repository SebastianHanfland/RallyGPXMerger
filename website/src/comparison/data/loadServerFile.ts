import { Dispatch } from '@reduxjs/toolkit';
import { comparisonActions } from '../store/tracks.reducer.ts';
import { State } from '../../planner/store/types.ts';
import { getPlanningTitle, setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { mapActions } from '../store/map.reducer.ts';
import { getStartAndEndOfParsedTracks } from '../../utils/parsedTracksUtil.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((res) => res.data)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            const calculatedTracks = planning.calculatedTracks.tracks;

            dispatch(
                mapActions.setStartAndEndTime({
                    ...getStartAndEndOfParsedTracks(calculatedTracks),
                    planningId: id,
                })
            );
            setParticipantsDelay(planning.trackMerge.participantDelay);
            dispatch(comparisonActions.setComparisonParsedTracks({ version: id, tracks: calculatedTracks }));
            dispatch(comparisonActions.setDisplayInformation({ version: id, versionTitle: planningTitle }));
            dispatch(comparisonActions.setSelectVersions([id]));
        })
        .catch(console.error)
        .finally();
}

import { Dispatch } from '@reduxjs/toolkit';
import { comparisonActions } from '../store/tracks.reducer';
import { State } from '../../planner/store/types';
import { getTrackCompositions } from '../../planner/store/trackMerge.reducer';
import { getData } from '../../api/api';
import { mapActions } from '../store/map.reducer';
import { getStartAndEndPlanning } from '../../utils/parsedTracksUtil';
import { getParticipantsDelay, getPlanningTitle } from '../../planner/store/settings.reducer';
import { getCalculateTracks } from '../../planner/calculation/getCalculatedTracks';
import { getConstructionSegments } from '../../planner/store/segmentData.redux';

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
            const tracksWithVersion = calculatedTracks.map((track) => ({ ...track, version: id }));
            dispatch(comparisonActions.setParticipantsDelay({ version: id, participantsDelay: delay }));
            dispatch(comparisonActions.setComparisonParsedTracks({ version: id, tracks: tracksWithVersion }));
            dispatch(comparisonActions.addConstructions(getConstructionSegments(planning)));
            dispatch(comparisonActions.setDisplayInformation({ version: id, versionTitle: planningTitle }));
            dispatch(comparisonActions.setSelectVersions([id]));
        })
        .catch((error) => {
            alert(`Error when loading Planning with id "${id}":\n${error}`);
            console.error(error);
        })
        .finally();
}

import { Dispatch } from '@reduxjs/toolkit';
import { DisplayTrack, ParsedTrack } from '../../common/types.ts';
import { State } from '../../planner/store/types.ts';
import { optionallyDecompress } from '../../planner/store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { getPlanningLabel, getPlanningTitle, setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { displayTracksActions } from '../store/displayTracksReducer.ts';
import { getEnrichedTrackStreetInfos } from '../../planner/logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { getBlockedStreetInfo } from '../../planner/logic/resolving/selectors/getBlockedStreetInfo.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((res) => res.data)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            dispatch(displayTracksActions.setTitle(planningTitle));
            dispatch(displayTracksActions.setEnrichedTrackStreetInfos(getEnrichedTrackStreetInfos(planning)));
            dispatch(displayTracksActions.setBlockStreetInfos(getBlockedStreetInfo(planning)));
            dispatch(displayTracksActions.setPlanningLabel(getPlanningLabel(planning)));

            const calculatedTracks: DisplayTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                peopleCount: track.peopleCount,
                filename: track.filename,
                id: track.id,
                version: id,
                color: getColorFromUuid(track.id),
                content: optionallyDecompress(track.content),
            }));
            const parsedTracks = planning.calculatedTracks.tracks.map(
                (track): ParsedTrack => ({
                    id: track.id,
                    filename: track.filename,
                    peopleCount: track.peopleCount,
                    version: id,
                    color: getColorFromUuid(track.id),
                    points: SimpleGPX.fromString(optionallyDecompress(track.content)).getPoints(),
                })
            );
            dispatch(displayTracksActions.setParsedTracks(parsedTracks));
            dispatch(displayTracksActions.setDisplayTracks(calculatedTracks));
            setParticipantsDelay(planning.trackMerge.participantDelay);
        })
        .catch(console.error)
        .finally();
}

import { Dispatch } from '@reduxjs/toolkit';
import { DisplayTrack, ParsedTrack } from '../../common/types.ts';
import { State } from '../../planner/store/types.ts';
import { optionallyDecompress } from '../../planner/store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { getPlanningTitle, setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { setStoredState } from './loadJsonFile.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { displayTracksActions } from '../store/displayTracksReducer.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((res) => res.data)
        .then((planning: State) => {
            setStoredState(planning);
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            dispatch(displayTracksActions.setTitle(planningTitle));

            const calculatedTracks: DisplayTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                ...track,
                id: track.id + '_' + id,
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

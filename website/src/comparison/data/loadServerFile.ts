import { Dispatch } from '@reduxjs/toolkit';
import { DisplayTrack, ParsedTrack } from '../../common/types.ts';
import { comparisonActions } from '../store/tracks.reducer.ts';
import { State } from '../../planner/store/types.ts';
import { optionallyDecompress } from '../../planner/store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { getPlanningTitle, setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { mapActions } from '../store/map.reducer.ts';
import { getStartAndEndOfParsedTracks } from '../../utils/parsedTracksUtil.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((res) => res.data)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            const calculatedTracks: DisplayTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                ...track,
                id: track.id + '_' + id,
                version: id,
                color: getColorFromUuid(id),
                content: optionallyDecompress(track.content),
            }));
            const parsedTracks = planning.calculatedTracks.tracks.map(
                (track): ParsedTrack => ({
                    id: track.id,
                    filename: track.filename,
                    peopleCount: track.peopleCount,
                    version: id,
                    color: getColorFromUuid(id),
                    points: SimpleGPX.fromString(optionallyDecompress(track.content)).getPoints(),
                })
            );

            dispatch(mapActions.setStartAndEndTime({ ...getStartAndEndOfParsedTracks(parsedTracks), planningId: id }));
            setParticipantsDelay(planning.trackMerge.participantDelay);
            dispatch(comparisonActions.setComparisonTracks({ version: id, tracks: calculatedTracks }));
            dispatch(comparisonActions.setComparisonParsedTracks({ version: id, tracks: parsedTracks }));
            dispatch(comparisonActions.setDisplayInformation({ version: id, versionTitle: planningTitle }));
            dispatch(comparisonActions.setSelectVersions([id]));
        })
        .catch(console.error)
        .finally();
}

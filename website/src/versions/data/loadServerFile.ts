import { Dispatch } from '@reduxjs/toolkit';
import { ZipTrack } from '../../common/types.ts';
import { extendReadableTracks } from '../cache/readableTracks.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';
import { State } from '../../planner/store/types.ts';
import { optionallyDecompress } from '../../planner/store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { getPlanningTitle, setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';
import { getData } from '../../api/api.ts';
import { setStoredState } from './loadJsonFile.ts';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((res) => res.data)
        .then((planning: State) => {
            setStoredState(planning);
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            const calculatedTracks: ZipTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                ...track,
                version: id,
                color: getColorFromUuid(track.id),
                content: optionallyDecompress(track.content),
            }));
            extendReadableTracks(
                calculatedTracks.map((track) => ({
                    id: track.id,
                    gpx: SimpleGPX.fromString(track.content),
                }))
            );
            setParticipantsDelay(planning.trackMerge.participantDelay);
            dispatch(zipTracksActions.setZipTracks({ version: id, tracks: calculatedTracks }));
            dispatch(zipTracksActions.setDisplayInformation({ version: id, versionTitle: planningTitle }));
            dispatch(zipTracksActions.selectVersion(id));
        })
        .catch(console.error)
        .finally();
}

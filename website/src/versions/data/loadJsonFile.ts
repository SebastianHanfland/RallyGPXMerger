import { Dispatch } from '@reduxjs/toolkit';
import { ZipTrack } from '../../common/types.ts';
import { extendReadableTracks } from '../cache/readableTracks.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';
import { Variant } from '../versionLinks.ts';
import { State } from '../../planner/store/types.ts';
import { optionallyDecompress } from '../../planner/store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';

export let storedState: State | undefined;

export async function loadJsonFileOfVersion(version: Variant, dispatch: Dispatch) {
    return fetch(version.url)
        .then((res) => res.json())
        .then((planning: State) => {
            // TODO: fix this, when there are multiple json uploads...
            storedState = planning;
            const calculatedTracks: ZipTrack[] = planning.calculatedTracks.tracks.map((track) => ({
                ...track,
                version: version.name,
                color: version.color ?? getColorFromUuid(track.id),
                content: optionallyDecompress(track.content),
            }));
            extendReadableTracks(
                calculatedTracks.map((track) => ({
                    id: track.id,
                    gpx: SimpleGPX.fromString(track.content),
                }))
            );
            dispatch(zipTracksActions.setZipTracks({ version: version.name, tracks: calculatedTracks }));
            dispatch(zipTracksActions.setSelectVersions([version.name]));
        })
        .catch(console.error)
        .finally();
}

import { Dispatch } from '@reduxjs/toolkit';
import JSZip from 'jszip';
import { ZipTrack } from '../../common/types.ts';
import { nameSpace } from './contants.ts';
import { v5 as uuidv5 } from 'uuid';
import { extendReadableTracks } from '../cache/readableTracks.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';
import { Variant } from '../versionLinks.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';

function getPeopleCountFromFilename(filename: string): number {
    console.log(filename);
    return 0;
}

export async function loadZipFileOfVersion(version: Variant, dispatch: Dispatch) {
    const zip = new JSZip();
    return fetch(version.url)
        .then((res) => res.blob())
        .then((blob) => {
            return zip.loadAsync(blob).then((zipContent) => {
                const readTracks: Promise<ZipTrack>[] = Object.entries(zipContent.files).map(
                    async ([filename, content]): Promise<ZipTrack> => {
                        const id = uuidv5(version.name + filename, nameSpace);
                        return content.async('text').then((text) => ({
                            id: id,
                            filename: `${version.name} ${filename}`,
                            content: text,
                            version: version.name,
                            peopleCount: getPeopleCountFromFilename(filename),
                            color: version.color ?? getColorFromUuid(id),
                        }));
                    }
                );
                return Promise.all(readTracks).then((tracks) => {
                    extendReadableTracks(
                        tracks.map((track) => ({ id: track.id, gpx: SimpleGPX.fromString(track.content) }))
                    );
                    dispatch(zipTracksActions.setZipTracks({ version: version.name, tracks: tracks }));
                    dispatch(zipTracksActions.selectVersion(version.name));
                });
            });
        })
        .catch(console.error)
        .finally();
}

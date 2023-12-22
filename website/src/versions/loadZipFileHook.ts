import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import JSZip from 'jszip';
import { ZipTrack } from '../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { extendReadableTracks } from '../logic/MergeCalculation.ts';
import { mapActions } from '../store/map.reducer.ts';
import { versions } from './versionLinks.ts';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';

function getPeopleCountFromFilename(filename: string): number {
    console.log(filename);
    return 0;
}

export function loadZipFileHook() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(mapActions.setShowCalculatedTracks(true));
        dispatch(zipTracksActions.removeZipTracks());
        dispatch(zipTracksActions.setIsLoading(true));
        Promise.all(
            versions.map((version) => {
                const zip = new JSZip();
                return fetch(version.url)
                    .then((res) => res.blob())
                    .then((blob) => {
                        zip.loadAsync(blob).then((zipContent) => {
                            const readTracks: Promise<ZipTrack>[] = Object.entries(zipContent.files).map(
                                async ([filename, content]): Promise<ZipTrack> => {
                                    return content.async('text').then((text) => ({
                                        id: uuidv4(),
                                        filename: `${version.name} ${filename}`,
                                        content: text,
                                        version: version.name,
                                        peopleCount: getPeopleCountFromFilename(filename),
                                    }));
                                }
                            );
                            Promise.all(readTracks).then((tracks) => {
                                extendReadableTracks(tracks.map((track) => SimpleGPX.fromString(track.content)));
                                dispatch(zipTracksActions.setZipTracks({ version: version.name, tracks: tracks }));
                            });
                        });
                    })
                    .catch(console.error)
                    .finally();
            })
        ).then(() => {
            dispatch(zipTracksActions.setIsLoading(false));
        });
    }, []);
}

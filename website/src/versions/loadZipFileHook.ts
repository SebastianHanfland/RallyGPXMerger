import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import JSZip from 'jszip';
import rally1 from '/rally1.zip?url';
import { CalculatedTrack } from '../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { setReadableTracks } from '../logic/MergeCalculation.ts';
import { mapActions } from '../store/map.reducer.ts';

export function loadZipFileHook() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(mapActions.setSource('tracks'));
        const zip = new JSZip();
        fetch(rally1)
            .then((res) => res.blob())
            .then((blob) => {
                zip.loadAsync(blob).then((zipContent) => {
                    const readTracks: Promise<CalculatedTrack>[] = Object.entries(zipContent.files).map(
                        async ([filename, content]) => {
                            return content.async('text').then((text) => ({
                                id: uuidv4(),
                                filename,
                                content: text,
                            }));
                        }
                    );
                    Promise.all(readTracks).then((tracks) => {
                        setReadableTracks(tracks.map((track) => SimpleGPX.fromString(track.content)));
                        dispatch(calculatedTracksActions.setCalculatedTracks(tracks));
                    });
                });
            });
    }, []);
}

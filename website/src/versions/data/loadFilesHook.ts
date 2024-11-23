import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { versionKey, versions } from '../versionLinks.ts';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { getReadableTracks } from '../cache/readableTracks.ts';
import { mapActions } from '../store/map.reducer.ts';
import { loadZipFileOfVersion } from './loadZipFile.ts';
import { loadJsonFileOfVersion } from './loadJsonFile.ts';

export function setStartAndEndTime(dispatch: Dispatch) {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    getReadableTracks()?.forEach((track) => {
        if (track.gpx.getStart() < startDate) {
            startDate = track.gpx.getStart();
        }

        if (track.gpx.getEnd() > endDate) {
            endDate = track.gpx.getEnd();
        }
    });

    const payload = {
        start: startDate,
        end: endDate,
    };
    if (
        endDate.startsWith(new Date().toISOString().substring(0, 10)) ||
        startDate.startsWith(new Date().toISOString().substring(0, 10))
    ) {
        dispatch(mapActions.setIsLive(true));
    }
    dispatch(mapActions.setStartAndEndTime(payload));
}

export function loadFilesHook() {
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        if (!versions[versionKey]) {
            alert('Unknown version');
        }
        dispatch(zipTracksActions.removeZipTracks());
        dispatch(zipTracksActions.setIsLoading(true));
        Promise.all(
            versions[versionKey].map((version) => {
                if (version.url.endsWith('.zip')) {
                    return loadZipFileOfVersion(version, dispatch);
                }
                if (version.url.endsWith('.json')) {
                    return loadJsonFileOfVersion(version, dispatch);
                }
                alert(`Unsupported file: ${version.name} (${version.url})\n Only json and zips are supported`);
            })
        ).then(() => {
            dispatch(zipTracksActions.setIsLoading(false));
            setStartAndEndTime(dispatch);
        });
    }, []);
}

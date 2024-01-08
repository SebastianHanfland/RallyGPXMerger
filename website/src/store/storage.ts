import { CalculatedTrack, GpxSegment, State } from './types.ts';

import { optionallyCompress } from './compressHelper.ts';

const localStorage = window.localStorage;

const stateKey = `gpxMerger.state`;

const save = (value: State) => {
    try {
        const { gpxSegments, calculatedTracks, geoCoding, trackMerge, map } = value;
        localStorage.setItem(stateKey + '.gpxSegments', JSON.stringify(gpxSegments));
        localStorage.setItem(stateKey + '.map', JSON.stringify(map));
        localStorage.setItem(stateKey + '.trackMerge', JSON.stringify(trackMerge));
        localStorage.setItem(stateKey + '.geoCoding', JSON.stringify(geoCoding));
        localStorage.setItem(stateKey + '.calculatedTracks', JSON.stringify(calculatedTracks));
    } catch (error) {
        console.log(error);
    }
};

const load = (): State | undefined => {
    try {
        let gpxSegments = undefined;
        let map = undefined;
        let trackMerge = undefined;
        let geoCoding = undefined;
        let calculatedTracks = undefined;

        const gpxSegmentsStringified = localStorage.getItem(stateKey + '.gpxSegments');
        if (gpxSegmentsStringified) {
            const parsedSegments = JSON.parse(gpxSegmentsStringified);
            const compressedSegments =
                parsedSegments.segments?.map((segment: GpxSegment) => ({
                    ...segment,
                    content: optionallyCompress(segment.content),
                })) ?? [];
            gpxSegments = { ...parsedSegments, segments: compressedSegments };
        }
        const mapStringified = localStorage.getItem(stateKey + '.map');
        if (mapStringified) {
            map = JSON.parse(mapStringified);
        }
        const trackMergeStringified = localStorage.getItem(stateKey + '.trackMerge');
        if (trackMergeStringified) {
            trackMerge = JSON.parse(trackMergeStringified);
            console.log({ trackMerge });
        }
        const geoCodingStringified = localStorage.getItem(stateKey + '.geoCoding');
        if (geoCodingStringified) {
            geoCoding = JSON.parse(geoCodingStringified);
        }
        const calculatedTracksStringified = localStorage.getItem(stateKey + '.calculatedTracks');
        if (calculatedTracksStringified) {
            const parsedTracks = JSON.parse(calculatedTracksStringified);
            const compressedTracks =
                parsedTracks.tracks?.map((segment: CalculatedTrack) => ({
                    ...segment,
                    content: optionallyCompress(segment.content),
                })) ?? [];
            calculatedTracks = { ...parsedTracks, tracks: compressedTracks };
        }
        return {
            gpxSegments,
            map,
            trackMerge,
            geoCoding,
            calculatedTracks,
        } as State;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

const clear = () => {
    try {
        localStorage.removeItem(stateKey);
        localStorage.removeItem(stateKey + '.gpxSegments');
        localStorage.removeItem(stateKey + '.map');
        localStorage.removeItem(stateKey + '.trackMerge');
        localStorage.removeItem(stateKey + '.geoCoding');
        localStorage.removeItem(stateKey + '.calculatedTracks');
    } catch (error) {
        console.log(error);
    }
};

export const storage = { save, load, clear };

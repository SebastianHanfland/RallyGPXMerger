import { State } from './types.ts';

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
            gpxSegments = JSON.parse(gpxSegmentsStringified);
        }
        const mapStringified = localStorage.getItem(stateKey + '.map');
        if (mapStringified) {
            map = JSON.parse(mapStringified);
        }
        const trackMergeStringified = localStorage.getItem(stateKey + '.trackMerge');
        if (trackMergeStringified) {
            trackMerge = JSON.parse(trackMergeStringified);
        }
        const geoCodingStringified = localStorage.getItem(stateKey + '.geoCoding');
        if (geoCodingStringified) {
            geoCoding = JSON.parse(geoCodingStringified);
        }
        const calculatedTracksStringified = localStorage.getItem(stateKey + '.calculatedTracks');
        if (calculatedTracksStringified) {
            calculatedTracks = JSON.parse(calculatedTracksStringified);
        }
        const item = localStorage.getItem(stateKey);
        if (item) {
            return {
                gpxSegments,
                map,
                trackMerge,
                geoCoding,
                calculatedTracks,
            } as State;
        }
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

const clear = () => {
    try {
        localStorage.removeItem(stateKey);
    } catch (error) {
        console.log(error);
    }
};

export const storage = { save, load, clear };

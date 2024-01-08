import { State } from './types.ts';
import LZString from 'lz-string';

const localStorage = window.localStorage;

const stateKey = `gpxMerger.state`;

const save = (value: State) => {
    try {
        localStorage.setItem(stateKey, LZString.compress(JSON.stringify(value)));
    } catch (error) {
        console.log(error);
    }
};

const load = (): State | undefined => {
    try {
        const item = localStorage.getItem(stateKey);
        if (item) {
            const storedState = item.includes('<trkpt>') ? item : LZString.decompress(item);
            return JSON.parse(storedState);
        }
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

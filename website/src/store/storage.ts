import { State } from './types.ts';

const localStorage = window.localStorage;

const stateKey = `gpxMerger.state`;

const save = (value: State) => {
    try {
        localStorage.setItem(stateKey, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
};

const load = (): State | undefined => {
    try {
        const item = localStorage.getItem(stateKey);
        if (item) {
            return JSON.parse(item);
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

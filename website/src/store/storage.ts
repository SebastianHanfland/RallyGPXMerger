import { State } from './types.ts';

const localStorage = window.localStorage;

const key = `gpxMerger.state`;

const save = (value: State) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
};

const load = (): State | undefined => {
    try {
        const item = localStorage.getItem(key);
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
        localStorage.clear();
    } catch (error) {
        console.log(error);
    }
};

export const storage = { save, load, clear };

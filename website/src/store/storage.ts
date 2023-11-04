import { ResolvePositions, State } from './types.ts';

const localStorage = window.localStorage;

const stateKey = `gpxMerger.state`;
const positionKey = `gpxMerger.positions`;

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

const saveResolvedPositions = (positions: ResolvePositions) => {
    const resolvedPositions = getResolvedPositions();
    Object.entries(positions).forEach(([key, value]) => {
        if (resolvedPositions[key] === null) {
            resolvedPositions[key] = value;
        }
        if (resolvedPositions[key] === undefined) {
            resolvedPositions[key] = null;
        }
    });
    try {
        localStorage.setItem(positionKey, JSON.stringify(resolvedPositions));
    } catch (error) {
        console.log(error);
    }
};

const getResolvedPositions = (): ResolvePositions => {
    try {
        const item = localStorage.getItem(positionKey);
        if (item) {
            return JSON.parse(item);
        }
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const storage = { save, load, clear, saveResolvedPositions, getResolvedPositions };

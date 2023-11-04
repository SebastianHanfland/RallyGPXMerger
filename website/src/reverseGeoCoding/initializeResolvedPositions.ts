import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { storage } from '../store/storage.ts';
import { ResolvePositions } from '../store/types.ts';

export const addResolvedPosition = (key: string, street: string) => {
    console.log('Resolving', key, !isPositionResolved(key));
    if (!isPositionResolved(key)) {
        storage.saveResolvedPositions({ [key]: street });
    }
};

export const isPositionResolved = (key: string): boolean => {
    return storage.getResolvedPositions()[key] !== undefined;
};

export function toKey({ lat, lon }: { lat: number; lon: number }): string {
    return `lat:${lat}-lng:${lon}`;
}

export function fromKey(key: string): { lat: number; lon: number } {
    const [preAndLat, lng] = key.split('-lng:');
    const lat = Number(preAndLat.replace('lat:', ''));
    const lon = Number(lng);
    return { lat, lon };
}

export const initializeResolvedPositions = (readableTracks: SimpleGPX[]) => {
    const positionMap: ResolvePositions = {};
    readableTracks?.forEach((gpx) => {
        gpx.tracks.forEach((track) => {
            track.points.forEach((point) => {
                if (Object.keys(positionMap).length < 10) {
                    positionMap[toKey(point)] = undefined;
                }
            });
        });
    });

    storage.saveResolvedPositions(positionMap);
};

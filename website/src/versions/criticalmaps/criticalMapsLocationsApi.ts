import { CriticalMapsLocation } from './types.ts';

const criticalMapsUrl = 'https://api-cdn.criticalmaps.net/locations';

export const fetchCriticalMapsLocation = async (): Promise<CriticalMapsLocation[]> => {
    return fetch(criticalMapsUrl)
        .then((response) => response.json())
        .catch(() => []);
};

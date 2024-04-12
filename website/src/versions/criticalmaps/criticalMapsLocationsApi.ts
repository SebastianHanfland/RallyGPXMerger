import { CriticalMapsLocation } from './types.ts';

const criticalMapsUrl = 'https://api-cdn.criticalmaps.net/locations';

export const fetchCriticalMapsLocation = async (): Promise<CriticalMapsLocation[]> => {
    return fetch(criticalMapsUrl, { cache: 'no-cache' })
        .then((response) => response.json())
        .catch(() => []);
};

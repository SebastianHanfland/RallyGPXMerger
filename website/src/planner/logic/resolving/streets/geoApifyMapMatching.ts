import { mapToPositionMap } from './mapToPositionMap.ts';
import { ResolvedPositions } from '../../../store/types.ts';

export type GeoApifyMapMatching = { mode: string; waypoints: { timestamp: string; location: [number, number] }[] };

function postRequest(body: Object) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
}

export const geoApifyFetchMapMatching =
    (apiKey: string) =>
    async (body: GeoApifyMapMatching): Promise<ResolvedPositions> => {
        return fetch(`https://api.geoapify.com/v1/mapmatching?apiKey=${apiKey}`, postRequest(body))
            .then((response) => response.json())
            .then((result) => {
                return mapToPositionMap(result);
            })
            .catch((error) => {
                console.log('error', error);
                return {};
            });
    };

import { mapToPositionMap } from './mapToPositionMap.ts';
import { ResolvePositions } from '../store/types.ts';

export type GeoApifyMapMatching = { mode: string; waypoints: { timestamp: string; location: [number, number] }[] };

function getBody(): GeoApifyMapMatching {
    return {
        mode: 'bicycle',
        waypoints: [
            { timestamp: '2019-11-04T07:09:34.000Z', location: [10.694703, 47.567028] },
            { timestamp: '2019-11-04T07:09:45.000Z', location: [10.6950319, 47.567783] },
            { timestamp: '2019-11-04T07:09:57.000Z', location: [10.6952599, 47.5682759] },
            { timestamp: '2019-11-04T07:10:07.000Z', location: [10.6965304, 47.5687653] },
            { timestamp: '2019-11-04T07:10:17.000Z', location: [10.6975647, 47.5691475] },
            { timestamp: '2019-11-04T07:10:28.000Z', location: [10.6984645, 47.5689924] },
            { timestamp: '2019-11-04T07:10:38.000Z', location: [10.6993804, 47.5695884] },
            { timestamp: '2019-11-04T07:10:49.000Z', location: [10.7004255, 47.5696526] },
            { timestamp: '2019-11-04T07:10:59.000Z', location: [10.7017509, 47.5691545] },
            { timestamp: '2019-11-04T07:11:34.000Z', location: [10.7028073, 47.5688025] },
            { timestamp: '2019-11-04T07:11:45.000Z', location: [10.7039882, 47.5684956] },
            { timestamp: '2019-11-04T07:11:55.000Z', location: [10.7059951, 47.5678558] },
            { timestamp: '2019-11-04T07:12:05.000Z', location: [10.7085059, 47.5668116] },
            { timestamp: '2019-11-04T07:12:16.000Z', location: [10.7106272, 47.5658437] },
            { timestamp: '2019-11-04T07:12:26.000Z', location: [10.7130338, 47.5651228] },
            { timestamp: '2019-11-04T07:12:37.000Z', location: [10.7154089, 47.5652946] },
            { timestamp: '2019-11-04T07:12:47.000Z', location: [10.7175699, 47.5655232] },
            { timestamp: '2019-11-04T07:12:58.000Z', location: [10.7203314, 47.5657987] },
            { timestamp: '2019-11-04T07:13:09.000Z', location: [10.7229241, 47.5660543] },
            { timestamp: '2019-11-04T07:13:20.000Z', location: [10.7252423, 47.5656265] },
            { timestamp: '2019-11-04T07:13:30.000Z', location: [10.7269064, 47.5647174] },
            { timestamp: '2019-11-04T07:13:41.000Z', location: [10.7275872, 47.5632757] },
            { timestamp: '2019-11-04T07:13:51.000Z', location: [10.7290924, 47.5617733] },
            { timestamp: '2019-11-04T07:14:02.000Z', location: [10.7312696, 47.560384] },
            { timestamp: '2019-11-04T07:14:13.000Z', location: [10.7330629, 47.5588335] },
            { timestamp: '2019-11-04T07:14:23.000Z', location: [10.7348687, 47.5579939] },
            { timestamp: '2019-11-04T07:14:33.000Z', location: [10.736509, 47.5568371] },
            { timestamp: '2019-11-04T07:14:44.000Z', location: [10.7384167, 47.5569489] },
            { timestamp: '2019-11-04T07:14:55.000Z', location: [10.740077, 47.556789] },
            { timestamp: '2019-11-04T07:15:21.000Z', location: [10.7405779, 47.5566208] },
            { timestamp: '2019-11-04T07:15:32.000Z', location: [10.7407534, 47.5562106] },
            { timestamp: '2019-11-04T07:15:43.000Z', location: [10.7399772, 47.555543] },
            { timestamp: '2019-11-04T07:16:00.000Z', location: [10.7395943, 47.5552649] },
            { timestamp: '2019-11-04T07:16:11.000Z', location: [10.7387026, 47.554868] },
            { timestamp: '2019-11-04T07:16:23.000Z', location: [10.7378114, 47.554748] },
        ],
    };
}

function postRequest(body: GeoApifyMapMatching = getBody()) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
}

export const geoApifyfetchMapMatching =
    (apiKey: string) =>
    (body: GeoApifyMapMatching = getBody()): Promise<ResolvePositions> => {
        return fetch(`https://api.geoapify.com/v1/mapmatching?apiKey=${apiKey}`, postRequest(body))
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                return mapToPositionMap(result);
            })
            .catch((error) => {
                console.log('error', error);
                return {};
            });
    };

import { StreetResolverTestCase, expectedStreet } from '../../fixtureHelpers.ts';
import geoApifyResponse from './geoapify-response.json';
import routeGpx from './route.gpx?raw';

export const evaluateDistanceOfResolving: StreetResolverTestCase = {
    name: 'evaluate-distance-of-resolving',
    routeGpx,
    geoApifyResponse,
    expectedStreets: [
        expectedStreet(48.366114, 10.894762, null),
        expectedStreet(48.366142, 10.894696, null),
        expectedStreet(48.36594, 10.894649, null),
        expectedStreet(48.365942, 10.894649, null),
        expectedStreet(48.365918, 10.894644, null),
        expectedStreet(48.365814, 10.8947, null),
        expectedStreet(48.365195, 10.895039, null),
        expectedStreet(48.365156, 10.89506, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365147, 10.895065, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365115, 10.895081, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365111, 10.895078, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.36511211396057, 10.895078938542127, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365087, 10.895061, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365051, 10.895065, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365041311300224, 10.89507017561172, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.365041, 10.89507, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.364817, 10.89519, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.364799, 10.8952, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.364606, 10.895303, 'Konrad-Adenauer-Allee'),
        expectedStreet(48.364413, 10.895405, 'Konrad-Adenauer-Allee'),
    ],
};

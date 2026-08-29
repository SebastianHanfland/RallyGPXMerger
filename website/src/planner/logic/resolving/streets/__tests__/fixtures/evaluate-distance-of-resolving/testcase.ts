import { StreetResolverTestCase, expectedStreet } from '../../fixtureHelpers.ts';
import geoApifyResponse from './geoapify-response.json';
import routeGpx from './route.gpx?raw';

export const evaluateDistanceOfResolving: StreetResolverTestCase = {
    name: 'evaluate-distance-of-resolving',
    routeGpx,
    geoApifyResponse,
    expectedStreets: [
        expectedStreet(48.366023, 10.894977, null),
        expectedStreet(48.366023, 10.894976, null),
        expectedStreet(48.366004, 10.894963, null),
        expectedStreet(48.365982, 10.894957, null),
        expectedStreet(48.365957, 10.894957, null),
        expectedStreet(48.365956, 10.894957, null),
        expectedStreet(48.365929, 10.894965, null),
        expectedStreet(48.365854, 10.895004, null),
        expectedStreet(48.36559, 10.895143, null),
        expectedStreet(48.365377, 10.895262, null),
        expectedStreet(48.365222, 10.895351, null),
        expectedStreet(48.365182, 10.895378, null),
        expectedStreet(48.365115, 10.895081, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.36511, 10.895078, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.365086, 10.895061, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.365051, 10.895064, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.365051, 10.895065, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.365041, 10.89507, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364817, 10.89519, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364816, 10.89519, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364799, 10.895199, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364799, 10.8952, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364606, 10.895303, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364605, 10.895303, '"Konrad-Adenauer-Allee"'),
        expectedStreet(48.364413, 10.895405, '"Konrad-Adenauer-Allee"'),
    ],
};

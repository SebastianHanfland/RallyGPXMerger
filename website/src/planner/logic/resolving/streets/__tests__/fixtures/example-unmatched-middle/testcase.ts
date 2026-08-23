import { StreetResolverTestCase, expectedStreet } from '../../fixtureHelpers.ts';
import geoApifyResponse from './geoapify-response.json';
import routeGpx from './route.gpx?raw';

export const exampleUnmatchedMiddleTestCase: StreetResolverTestCase = {
    name: 'example-unmatched-middle',
    routeGpx,
    geoApifyResponse,
    expectedStreets: [
        expectedStreet(48.2, 11.2, 'First Street'),
        expectedStreet(48.2001, 11.2001, 'First Street'),
        expectedStreet(48.2002, 11.2002, 'First Street'),
        expectedStreet(48.2003, 11.2003, 'Second Street'),
        expectedStreet(48.2004, 11.2004, 'Second Street'),
    ],
};

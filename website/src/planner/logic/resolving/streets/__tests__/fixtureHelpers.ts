export interface ExpectedStreetPoint {
    lat: number;
    lon: number;
    streetName: string | null;
}

export interface StreetResolverTestCase {
    name: string;
    routeGpx: string;
    geoApifyResponse: unknown;
    expectedStreets: ExpectedStreetPoint[];
}

export function expectedStreet(lat: number, lon: number, streetName: string | null): ExpectedStreetPoint {
    return { lat, lon, streetName };
}

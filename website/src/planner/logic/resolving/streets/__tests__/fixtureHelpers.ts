export interface ExpectedStreetPoint {
    lat: number;
    lon: number;
    streetName: string | null;
}

export function expectedStreet(lat: number, lon: number, streetName: string | null): ExpectedStreetPoint {
    return { lat, lon, streetName };
}

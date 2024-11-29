import { useLocation } from 'react-router';

export function getLink(waypoint: { pointFrom: { lat: number; lon: number }; pointTo: { lat: number; lon: number } }) {
    if (waypoint.pointTo.lat === waypoint.pointFrom.lat && waypoint.pointTo.lon === waypoint.pointFrom.lon) {
        // return `https://www.openstreetmap.org/#map=17/${waypoint.pointTo.lat}/${waypoint.pointTo.lon}`;
        // return `https://www.google.com/maps/search/${waypoint.pointTo.lat},${waypoint.pointTo.lon}`;
        return `https://www.openstreetmap.org/?mlat=${waypoint.pointTo.lat}&mlon=${waypoint.pointTo.lon}#map=17/${waypoint.pointTo.lat}/${waypoint.pointTo.lon}`;
    }
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${waypoint.pointFrom.lat}%2C${waypoint.pointFrom.lon}%3B${waypoint.pointTo.lat}%2C${waypoint.pointTo.lon}`;
}

export function useGetUrlParam(paramArg: string): string | undefined {
    const { search } = useLocation();
    console.log(search);
    return search
        .replace('?', '')
        .split('&')
        .find((param) => param.startsWith(paramArg))
        ?.replace(paramArg, '');
}

export function getBaseUrl() {
    return window.location.origin + window.location.pathname;
}

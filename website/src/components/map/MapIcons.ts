import L from 'leaflet';

const MARKER_SIZE = 24;
export const startIcon = L.icon({
    iconUrl: 'geo-alt.svg',
    iconSize: [MARKER_SIZE, MARKER_SIZE], // size of the icon
    iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE], // point of the icon which will correspond to marker's location
});

export const endIcon = L.icon({
    iconUrl: 'geo-alt-filled.svg',
    iconSize: [MARKER_SIZE, MARKER_SIZE], // size of the icon
    iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE], // point of the icon which will correspond to marker's location
});

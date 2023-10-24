import { Point } from 'gpxparser';
import { CalculatedTrack, GpxSegment } from '../../store/types.ts';
import L, { LayerGroup } from 'leaflet';
import { SimpleGPX } from '../../logic/SimpleGPX.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { endIcon, startIcon } from './MapIcons.ts';

function toLatLng(point: Point): { lat: number; lng: number } {
    return { lat: point.lat, lng: point.lon };
}

export function addTrackToMap(gpxSegment: CalculatedTrack | GpxSegment, routeLayer: LayerGroup) {
    const gpx = SimpleGPX.fromString(gpxSegment.content);
    gpx.tracks.forEach((track) => {
        const trackPoints = track.points.map(toLatLng);
        const connection = L.polyline(trackPoints, { color: getColorFromUuid(gpxSegment.id) });
        connection.addTo(routeLayer);
        const startMarker = L.marker(trackPoints[0], {
            icon: startIcon,
            title: gpxSegment.filename,
        });
        startMarker.addTo(routeLayer);
        const endMarker = L.marker(trackPoints.reverse()[0], {
            icon: endIcon,
            title: gpxSegment.filename,
        });
        endMarker.addTo(routeLayer);
    });
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: CalculatedTrack[] | GpxSegment[]
) {
    const current = calculatedTracksLayer.current;
    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    calculatedTracks.forEach((track) => {
        addTrackToMap(track, current);
    });
}

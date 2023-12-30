import { Point } from 'gpxparser';
import { CalculatedTrack, GpxSegment, isZipTrack, ZipTrack } from '../../../store/types.ts';
import L, { LayerGroup } from 'leaflet';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { getColorFromUuid } from '../../../utils/colorUtil.ts';
import { endIcon, startIcon } from '../MapIcons.ts';

function toLatLng(point: Point): { lat: number; lng: number } {
    return { lat: point.lat, lng: point.lon };
}

export interface MapOptions {
    showMarker: boolean;
    color?: string;
    opacity?: number;
    weight?: number;
}

export function addTrackToMap(gpxSegment: CalculatedTrack | GpxSegment, routeLayer: LayerGroup, options: MapOptions) {
    const gpx = SimpleGPX.fromString(gpxSegment.content);
    gpx.tracks.forEach((track) => {
        const trackPoints = track.points.map(toLatLng);
        const connection = L.polyline(trackPoints, {
            weight: options.weight ?? 8,
            color: options.color ?? getColorFromUuid(gpxSegment.id),
            opacity: options.opacity ?? 0.6,
        }).bindTooltip(gpxSegment.filename, {
            sticky: true,
        });
        connection.addTo(routeLayer);
        if (options.showMarker) {
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
        }
    });
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: CalculatedTrack[] | GpxSegment[] | ZipTrack[],
    show: boolean,
    options: MapOptions
) {
    const current = calculatedTracksLayer.current;
    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        calculatedTracks.forEach((track) => {
            const enhancedOptions = isZipTrack(track) ? { ...options, color: track.color } : options;
            addTrackToMap(track, current, enhancedOptions);
        });
    }
}

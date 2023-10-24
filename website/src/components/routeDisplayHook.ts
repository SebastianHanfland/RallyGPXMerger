import { useSelector } from 'react-redux';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { GpxSegment } from '../store/types.ts';
import { SimpleGPX } from '../logic/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { endIcon, startIcon } from './map/MapIcons.ts';
import { getColorFromUuid } from '../utils/colorUtil.ts';

function toLatLng(point: Point): { lat: number; lng: number } {
    return { lat: point.lat, lng: point.lon };
}

function addGpxToMap(gpxSegment: GpxSegment, routeLayer: LayerGroup) {
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

export function routeHook(routeLayer: MutableRefObject<LayerGroup | null>) {
    const gpxSegments = useSelector(getGpxSegments);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = routeLayer.current;
        if (!routeLayer || !current) {
            return;
        }
        current.clearLayers();
        gpxSegments.forEach((gpxSegment) => {
            addGpxToMap(gpxSegment, current);
        });
    }, [gpxSegments]);
}

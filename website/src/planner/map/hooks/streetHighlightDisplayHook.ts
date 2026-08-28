import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { useSelector } from 'react-redux';
import { getHighlightedStreetPath } from '../../store/map.reducer.ts';
import { TRACK_MARKER } from '../panes.ts';

export function streetHighlightDisplayHook(streetHighlightLayer: RefObject<LayerGroup | null>) {
    const highlightedStreetPath = useSelector(getHighlightedStreetPath);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = streetHighlightLayer.current;
        if (!current) {
            return;
        }

        current.clearLayers();
        if (highlightedStreetPath && highlightedStreetPath.length > 0) {
            const points = highlightedStreetPath.map((point) => ({ lat: point.lat, lng: point.lon }));
            L.polyline(points, { color: 'red', opacity: 1, weight: 15 }).addTo(current);
            points.forEach((point) => {
                L.circleMarker(point, {
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 1,
                    pane: TRACK_MARKER,
                    radius: 7.5,
                    weight: 1,
                }).addTo(current);
            });
        }
    }, [highlightedStreetPath, streetHighlightLayer]);
}

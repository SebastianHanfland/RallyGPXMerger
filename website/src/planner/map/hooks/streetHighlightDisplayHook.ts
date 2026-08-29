import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { useSelector } from 'react-redux';
import { getHighlightedStreetPath } from '../../store/map.reducer.ts';
import { TRACK_MARKER } from '../panes.ts';
import { getCorrectStreetLookup } from '../../logic/resolving/selectors/getLookups.ts';

export function streetHighlightDisplayHook(streetHighlightLayer: RefObject<LayerGroup | null>) {
    const highlightedStreetPath = useSelector(getHighlightedStreetPath);
    const streetLookup = useSelector(getCorrectStreetLookup);

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
            highlightedStreetPath.forEach((pathPoint) => {
                const point = { lat: pathPoint.lat, lng: pathPoint.lon };
                const marker = L.circleMarker(point, {
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 1,
                    pane: TRACK_MARKER,
                    radius: 7.5,
                    weight: 1,
                });
                const streetName = pathPoint.s === undefined ? undefined : streetLookup[pathPoint.s];
                if (streetName) {
                    marker.bindTooltip(streetName, { sticky: true });
                }
                marker.addTo(current);
            });
        }
    }, [highlightedStreetPath, streetHighlightLayer, streetLookup]);
}

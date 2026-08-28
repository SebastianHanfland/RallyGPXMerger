import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { useSelector } from 'react-redux';
import { getHighlightedStreetPath } from '../../store/map.reducer.ts';

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
            L.polyline(
                highlightedStreetPath.map((point) => ({ lat: point.lat, lng: point.lon })),
                { color: 'red', opacity: 1, weight: 15 }
            ).addTo(current);
        }
    }, [highlightedStreetPath, streetHighlightLayer]);
}

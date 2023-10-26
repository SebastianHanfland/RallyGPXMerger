import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getCurrenMapSource, getCurrenMapTime } from '../../store/map.reducer.ts';
import { getCurrentMarkerPositionsForTracks } from './trackSimulationReader.ts';
import { bikeIcon } from './MapIcons.ts';

export function trackMarkerDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const mapSource = useSelector(getCurrenMapSource);
    const currentMapTime = useSelector(getCurrenMapTime);
    const pointsToDisplay = useSelector(getCurrentMarkerPositionsForTracks);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, pointsToDisplay, mapSource === 'tracks');
    }, [calculatedTracks, mapSource, currentMapTime]);
}

export function addTrackToMap(points: { lat: number; lng: number }[], routeLayer: LayerGroup) {
    if (points.length === 0) {
        return;
    }
    const trackMarker = L.marker(points.reverse()[0], {
        icon: bikeIcon,
        title: 'None',
    });
    const trackSnake = L.polyline(points, { weight: 10 });
    trackMarker.addTo(routeLayer);
    trackSnake.addTo(routeLayer);
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: { lat: number; lng: number }[][],
    show: boolean
) {
    const current = calculatedTracksLayer.current;
    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        calculatedTracks.forEach((track) => {
            addTrackToMap(track, current);
        });
    }
}

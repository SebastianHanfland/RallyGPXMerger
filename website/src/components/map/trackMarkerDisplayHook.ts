import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getCurrenMapSource, getCurrenMapTime } from '../../store/map.reducer.ts';
import { getCurrentMarkerPositionsForTracks } from './trackSimulationReader.ts';
import { trackIcon } from './MapIcons.ts';

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

export function addTrackToMap(point: { lat: number; lng: number }, routeLayer: LayerGroup) {
    const trackMarker = L.marker(point, {
        icon: trackIcon,
        title: 'None',
    });
    trackMarker.addTo(routeLayer);
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: { lat: number; lng: number }[],
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

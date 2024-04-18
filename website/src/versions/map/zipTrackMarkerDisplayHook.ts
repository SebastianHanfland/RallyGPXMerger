import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { bikeIcon } from '../../common/MapIcons.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/zipTracks.reducer.ts';
import { getDisplayTimeStamp, getZipCurrentMarkerPositionsForTracks } from './dataReading.ts';

export function zipTrackMarkerDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const zipTracks = useSelector(getZipTracks);
    const currentMapTime = useSelector(getDisplayTimeStamp);
    const selectedTracks = useSelector(getSelectedTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const pointsToDisplay = useSelector(getZipCurrentMarkerPositionsForTracks);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, pointsToDisplay, true);
    }, [zipTracks, currentMapTime, selectedTracks, selectedVersions]);
}

export function addTrackToMap(
    points: { lat: number; lng: number }[],
    trackName: string,
    trackColor: string,
    routeLayer: LayerGroup
) {
    if (points.length === 0) {
        return;
    }
    const trackMarker = L.marker(points.reverse()[0], {
        icon: bikeIcon,
        title: trackName,
    });
    const trackSnake = L.polyline(points, { weight: 20, color: trackColor, opacity: 1 });
    trackMarker.addTo(routeLayer);
    trackSnake.addTo(routeLayer);
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: { trackPositions: { lat: number; lng: number }[]; name: string; color: string }[],
    show: boolean
) {
    const current = calculatedTracksLayer.current;

    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        calculatedTracks.forEach((track) => {
            addTrackToMap(track.trackPositions, track.name, track.color, current);
        });
    }
}

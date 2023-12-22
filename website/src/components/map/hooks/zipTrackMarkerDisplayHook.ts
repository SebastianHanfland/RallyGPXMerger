import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getCurrenMapTime, getShowCalculatedTracks } from '../../../store/map.reducer.ts';
import { getZipCurrentMarkerPositionsForTracks } from './trackSimulationReader.ts';
import { bikeIcon } from '../MapIcons.ts';
import { getColorFromUuid } from '../../../utils/colorUtil.ts';
import { getZipTracks } from '../../../store/zipTracks.reducer.ts';

const isDefined = <T>(arg: T | undefined | null): arg is T => arg !== undefined && arg !== null;

export function zipTrackMarkerDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const zipTracks = useSelector(getZipTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const currentMapTime = useSelector(getCurrenMapTime);
    const pointsToDisplay = useSelector(getZipCurrentMarkerPositionsForTracks);
    const trackIds = Object.values(useSelector(getZipTracks))
        .flatMap((tracks) => tracks?.map((track) => track.id))
        .filter(isDefined);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, pointsToDisplay, trackIds, showTracks);
    }, [zipTracks, showTracks, currentMapTime]);
}

export function addTrackToMap(points: { lat: number; lng: number }[], trackId: string, routeLayer: LayerGroup) {
    if (points.length === 0) {
        return;
    }
    const trackMarker = L.marker(points.reverse()[0], {
        icon: bikeIcon,
        title: 'None',
    });
    const trackSnake = L.polyline(points, { weight: 20, color: getColorFromUuid(trackId), opacity: 1 });
    trackMarker.addTo(routeLayer);
    trackSnake.addTo(routeLayer);
}

export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: { lat: number; lng: number }[][],
    trackIds: string[],
    show: boolean
) {
    const current = calculatedTracksLayer.current;

    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        calculatedTracks.forEach((track, index) => {
            addTrackToMap(track, trackIds[index], current);
        });
    }
}

import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getFilteredCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getShowCalculatedTracks, getShowMapMarker } from '../../../store/map.reducer.ts';

export function calculatedTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getFilteredCalculatedTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const showMapMarker = useSelector(getShowMapMarker);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, calculatedTracks, showTracks, showMapMarker);
    }, [calculatedTracks, calculatedTracks.length, showTracks, showMapMarker]);
}

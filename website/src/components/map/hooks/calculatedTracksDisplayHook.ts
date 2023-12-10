import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getCurrenMapSource, getShowMapMarker } from '../../../store/map.reducer.ts';

export function calculatedTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const mapSource = useSelector(getCurrenMapSource);
    const showMapMarker = useSelector(getShowMapMarker);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, calculatedTracks, mapSource === 'tracks', showMapMarker);
    }, [calculatedTracks, calculatedTracks.length, mapSource, showMapMarker]);
}

import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from './addTrackToMap.ts';

export function calculatedTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, calculatedTracks);
    }, [calculatedTracks]);
}

import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getShowCalculatedTracks, getShowMapMarker } from '../../../store/map.reducer.ts';
import { getZipTracks } from '../../../store/zipTracks.reducer.ts';

export function zipTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getZipTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const showMarker = useSelector(getShowMapMarker);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const calculatedTrack = calculatedTracks[Object.keys(calculatedTracks)[0]] ?? [];
        addTracksToLayer(calculatedTracksLayer, calculatedTrack, showTracks, {
            showMarker,
            opacity: 0.7,
        });
    }, [calculatedTracks, calculatedTracks.length, showTracks, showMarker]);
}

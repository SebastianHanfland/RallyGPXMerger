import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getCurrenMapSource, getCurrenMapTime } from '../../store/map.reducer.ts';

export function trackMarkerDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const mapSource = useSelector(getCurrenMapSource);
    const currentMapTime = useSelector(getCurrenMapTime);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, calculatedTracks, mapSource === 'tracks');
    }, [calculatedTracks, mapSource, currentMapTime]);
}

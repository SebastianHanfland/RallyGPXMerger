import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getCurrenMapSource } from '../../../store/map.reducer.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const gpxSegments = useSelector(getGpxSegments);
    const mapSource = useSelector(getCurrenMapSource);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(gpxSegmentsLayer, gpxSegments, mapSource === 'segments');
    }, [gpxSegments, gpxSegments.length, mapSource]);
}

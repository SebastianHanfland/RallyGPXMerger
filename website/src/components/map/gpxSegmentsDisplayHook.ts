import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from './addTrackToMap.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const gpxSegments = useSelector(getGpxSegments);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(gpxSegmentsLayer, gpxSegments);
    }, [gpxSegments]);
}

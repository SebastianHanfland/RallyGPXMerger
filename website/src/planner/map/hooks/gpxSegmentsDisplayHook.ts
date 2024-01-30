import { useSelector } from 'react-redux';
import { getFilteredGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getShowGpxSegments, getShowMapMarker } from '../../store/map.reducer.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const gpxSegments = useSelector(getFilteredGpxSegments);
    const showSegments = useSelector(getShowGpxSegments);
    const showMarker = useSelector(getShowMapMarker);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(gpxSegmentsLayer, gpxSegments, showSegments, { showMarker });
    }, [gpxSegments, gpxSegments.length, showSegments, showMarker]);
}

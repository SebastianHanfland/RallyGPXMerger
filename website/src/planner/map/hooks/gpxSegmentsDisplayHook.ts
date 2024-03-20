import { useSelector } from 'react-redux';
import { getFilteredGpxSegments, getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMap.ts';
import { getHighlightedSegmentId, getShowGpxSegments, getShowMapMarker } from '../../store/map.reducer.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const filteredGpxSegments = useSelector(getFilteredGpxSegments);
    const gpxSegments = useSelector(getGpxSegments);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const showSegments = useSelector(getShowGpxSegments) || !!highlightedSegmentId;
    const showMarker = useSelector(getShowMapMarker);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = highlightedSegmentId
            ? gpxSegments.filter(({ id }) => id === highlightedSegmentId)
            : filteredGpxSegments;

        addTracksToLayer(gpxSegmentsLayer, tracks, showSegments, {
            showMarker,
            opacity: highlightedSegmentId ? 100 : undefined,
            weight: highlightedSegmentId ? 15 : undefined,
        });
    }, [filteredGpxSegments, filteredGpxSegments.length, showSegments, showMarker, highlightedSegmentId]);
}

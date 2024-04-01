import { useDispatch, useSelector } from 'react-redux';
import { getFilteredGpxSegments, getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMap.ts';
import { getHighlightedSegmentId, getShowGpxSegments, getShowMapMarker, mapActions } from '../../store/map.reducer.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const filteredGpxSegments = useSelector(getFilteredGpxSegments);
    const gpxSegments = useSelector(getGpxSegments);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const showSegments = useSelector(getShowGpxSegments) || !!highlightedSegmentId;
    const showMarker = useSelector(getShowMapMarker);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = highlightedSegmentId
            ? gpxSegments.filter(({ id }) => id === highlightedSegmentId)
            : filteredGpxSegments;

        addTracksToLayer(gpxSegmentsLayer, tracks, showSegments, {
            showMarker,
            opacity: highlightedSegmentId ? 100 : undefined,
            weight: highlightedSegmentId ? 15 : undefined,
            mouseInCallBack: (track) => {
                dispatch(mapActions.setHighlightedSegmentId(track.id));
            },
            mouseOutCallBack: () => {
                dispatch(mapActions.setHighlightedSegmentId());
            },
        });
    }, [filteredGpxSegments, filteredGpxSegments.length, showSegments, showMarker, highlightedSegmentId]);
}

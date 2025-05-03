import { useDispatch, useSelector } from 'react-redux';
import { getFilteredGpxSegments, gpxSegmentsActions } from '../../store/gpxSegments.reducer.ts';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer.ts';
import { getHighlightedSegmentId, getShowGpxSegments, getShowMapMarker, mapActions } from '../../store/map.reducer.ts';
import { getParsedSegments } from '../../store/parsedTracks.reducer.ts';

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const filteredGpxSegments = useSelector(getFilteredGpxSegments);
    const gpxSegments = useSelector(getParsedSegments);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const showSegments = useSelector(getShowGpxSegments) || !!highlightedSegmentId;
    const showMarker = useSelector(getShowMapMarker) ?? false;
    const dispatch = useDispatch();
    const filteredSegmentIds = filteredGpxSegments.map(({ id }) => id);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = highlightedSegmentId
            ? gpxSegments?.filter(({ id }) => id === highlightedSegmentId) ?? []
            : gpxSegments?.filter(({ id }) => filteredSegmentIds.includes(id)) ?? [];

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
            clickCallBack: (gpxSegment, event) => {
                if (event) {
                    dispatch(gpxSegmentsActions.setClickOnSegment({ ...event.latlng, segmentId: gpxSegment.id }));
                }
            },
        });
    }, [filteredGpxSegments, filteredGpxSegments.length, showSegments, showMarker, highlightedSegmentId]);
}

import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer.ts';
import { getHighlightedSegmentId, getShowGpxSegments, getShowMapMarker, mapActions } from '../../store/map.reducer.ts';
import { getFilteredGpxSegments, getParsedGpxSegments, segmentDataActions } from '../../store/segmentData.redux.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { State } from '../../store/types.ts';

const setMarkHighlightedTrackPlain =
    (trackId: string | undefined) => (dispatch: AppDispatch, getState: () => State) => {
        if (getHighlightedSegmentId(getState()) === trackId) {
            return;
        }

        dispatch(mapActions.setHighlightedSegmentId(trackId));
    };

export function gpxSegmentDisplayHook(gpxSegmentsLayer: MutableRefObject<LayerGroup | null>) {
    const filteredGpxSegments = useSelector(getFilteredGpxSegments);
    const gpxSegments = useSelector(getParsedGpxSegments);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const showSegments = useSelector(getShowGpxSegments) || !!highlightedSegmentId;
    const showMarker = useSelector(getShowMapMarker) ?? false;
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(mapActions.setHighlightedSegmentId());
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = highlightedSegmentId
            ? gpxSegments?.filter(({ id }) => id === highlightedSegmentId) ?? []
            : filteredGpxSegments ?? [];

        addTracksToLayer(gpxSegmentsLayer, tracks, showSegments, {
            showMarker,
            opacity: highlightedSegmentId ? 100 : undefined,
            weight: highlightedSegmentId ? 15 : undefined,
            mouseInCallBack: (track) => {
                dispatch(setMarkHighlightedTrackPlain(track.id));
                setTimeout(() => dispatch(setMarkHighlightedTrackPlain(undefined)), 2000);
            },
            mouseOutCallBack: () => {
                dispatch(setMarkHighlightedTrackPlain(undefined));
            },
            clickCallBack: (gpxSegment, event) => {
                if (event) {
                    dispatch(segmentDataActions.setClickOnSegment({ ...event.latlng, segmentId: gpxSegment.id }));
                }
            },
        });
    }, [filteredGpxSegments, filteredGpxSegments.length, showSegments, showMarker, highlightedSegmentId]);
}

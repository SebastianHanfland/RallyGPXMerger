import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getFilteredCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer.ts';
import { getHighlightedSegmentId, getShowCalculatedTracks, getShowMapMarker } from '../../store/map.reducer.ts';
import { getHasSingleTrack, layoutActions } from '../../store/layout.reducer.ts';

export function calculatedTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getFilteredCalculatedTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const showMarker = useSelector(getShowMapMarker);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const hasSingleTrack = useSelector(getHasSingleTrack);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, calculatedTracks, Boolean(showTracks), {
            showMarker: Boolean(showMarker),
            opacity: highlightedSegmentId ? 0.2 : 0.7,
            clickCallBack: (track) => {
                if (!hasSingleTrack) {
                    dispatch(layoutActions.setSelectedSidebarSection('tracks'));
                    dispatch(layoutActions.setSelectedTrackId(track.id));
                }
            },
        });
    }, [calculatedTracks, calculatedTracks.length, showTracks, showMarker, highlightedSegmentId]);
}

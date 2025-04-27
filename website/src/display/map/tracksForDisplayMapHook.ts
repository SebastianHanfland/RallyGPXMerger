import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMap.ts';
import { getHighlightedTrack, getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';

export function tracksForDisplayMapHook(
    calculatedTracksLayer: MutableRefObject<LayerGroup | null>,
    showMarkerOverwrite?: boolean
) {
    const displayTracks = useSelector(getDisplayTracks);
    const showMarker = useSelector(getShowMapMarker) || !!showMarkerOverwrite;
    const highlightedTrack = useSelector(getHighlightedTrack);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, displayTracks, true, {
            showMarker,
            onlyShowBreaks: true,
            opacity: highlightedTrack ? 0.2 : 0.7,
            highlightedId: highlightedTrack,
            clickCallBack: (track) => {
                dispatch(mapActions.setShowTrackInfo(true));
                dispatch(mapActions.setShowSingleTrackInfo(track.id));
            },
            mouseInCallBack: (track) => {
                dispatch(mapActions.setHighlightedTrack(track.id));
            },
            mouseOutCallBack: () => {
                dispatch(mapActions.setHighlightedTrack());
            },
        });
    }, [displayTracks, displayTracks.length, showMarker, highlightedTrack]);
}

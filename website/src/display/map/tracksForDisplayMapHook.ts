import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMapLayer.ts';
import { getHighlightedTrack, displayMapActions } from '../store/displayMapReducer.ts';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';

export function tracksForDisplayMapHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const displayTracks = useSelector(getDisplayTracks);
    const highlightedTrack = useSelector(getHighlightedTrack);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, displayTracks, true, {
            showMarker: true,
            opacity: highlightedTrack ? 0.2 : 0.7,
            highlightedId: highlightedTrack,
            clickCallBack: (track) => {
                dispatch(displayMapActions.setShowTrackInfo(true));
                dispatch(displayMapActions.setShowSingleTrackInfo(track.id));
            },
            mouseInCallBack: (track) => {
                dispatch(displayMapActions.setHighlightedTrack(track.id));
            },
            mouseOutCallBack: () => {
                dispatch(displayMapActions.setHighlightedTrack());
            },
        });
    }, [displayTracks, displayTracks.length, highlightedTrack]);
}

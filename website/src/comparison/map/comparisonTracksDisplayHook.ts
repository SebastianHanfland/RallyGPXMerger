import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMapLayer.ts';
import { getHighlightedTrack, getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getComparisonParsedTracks, getSelectedTracks, getSelectedVersions } from '../store/tracks.reducer.ts';

export function comparisonTracksDisplayHook(
    calculatedTracksLayer: MutableRefObject<LayerGroup | null>,
    showMarkerOverwrite?: boolean
) {
    const parsedTracks = useSelector(getComparisonParsedTracks);
    const showMarker = useSelector(getShowMapMarker) || !!showMarkerOverwrite;
    const selectedVersions = useSelector(getSelectedVersions);
    const selectedTracks = useSelector(getSelectedTracks);
    const highlightedTrack = useSelector(getHighlightedTrack);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = selectedVersions.flatMap((version) => {
            const tracksOfVersion = parsedTracks[version] ?? [];
            if ((selectedTracks[version]?.length ?? 0) === 0) {
                return tracksOfVersion;
            }
            const selectedTracksOfVersion = tracksOfVersion
                .filter((track) => selectedTracks[version]?.includes(track.id))
                .sort((a, b) => b.filename.localeCompare(a.filename, undefined, { numeric: true }));

            console.log(selectedTracksOfVersion.map((track) => track.filename));
            return selectedTracksOfVersion;
        });

        const sortedTracks = tracks.sort((a, b) => -b.filename.localeCompare(a.filename, undefined, { numeric: true }));

        addTracksToLayer(calculatedTracksLayer, sortedTracks, true, {
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
    }, [parsedTracks, parsedTracks.length, selectedTracks, selectedVersions, showMarker, highlightedTrack]);
}

import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMap.ts';
import { getHighlightedTrack, getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/zipTracks.reducer.ts';

export function zipTracksDisplayHook(
    calculatedTracksLayer: MutableRefObject<LayerGroup | null>,
    showMarkerOverwrite?: boolean
) {
    const zipTracks = useSelector(getZipTracks);
    const showMarker = useSelector(getShowMapMarker) || !!showMarkerOverwrite;
    const selectedVersions = useSelector(getSelectedVersions);
    const selectedTracks = useSelector(getSelectedTracks);
    const highlightedTrack = useSelector(getHighlightedTrack);
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = selectedVersions.flatMap((version) => {
            const tracksOfVersion = zipTracks[version] ?? [];
            if ((selectedTracks[version]?.length ?? 0) === 0) {
                return tracksOfVersion;
            }
            const zipTracks1 = tracksOfVersion
                .filter((track) => selectedTracks[version]?.includes(track.id))
                .sort((a, b) => b.filename.localeCompare(a.filename, undefined, { numeric: true }));

            console.log(zipTracks1.map((track) => track.filename));
            return zipTracks1;
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
    }, [zipTracks, zipTracks.length, selectedTracks, selectedVersions, showMarker, highlightedTrack]);
}

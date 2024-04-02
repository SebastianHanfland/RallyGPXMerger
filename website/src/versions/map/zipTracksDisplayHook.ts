import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMap.ts';
import { getHighlightedTrack, getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/zipTracks.reducer.ts';
import { versionKey } from '../versionLinks.ts';

const motorwayUnsecurityPoint = {
    lat: 48.1095121,
    lng: 11.5196071,
    radiusInM: 2000,
    title: 'Planung in diesem Bereich ist vorläufig',
};

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
            return tracksOfVersion.filter((track) => selectedTracks[version]?.includes(track.id));
        });
        const tracksToDisplay = highlightedTrack ? tracks.filter((track) => track.id === highlightedTrack) : tracks;
        addTracksToLayer(calculatedTracksLayer, tracksToDisplay, true, {
            showMarker,
            onlyShowBreaks: true,
            opacity: highlightedTrack ? 1 : 0.7,
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
        if (versionKey === 'Sternfahrt2024') {
            const circle = L.circle(motorwayUnsecurityPoint, {
                radius: motorwayUnsecurityPoint.radiusInM,
                color: 'red',
            });
            const current = calculatedTracksLayer.current;
            if (current) {
                circle.bindTooltip(motorwayUnsecurityPoint.title, { sticky: true });
                circle.addTo(current);
            }
        }
    }, [zipTracks, zipTracks.length, selectedTracks, selectedVersions, showMarker, highlightedTrack]);
}

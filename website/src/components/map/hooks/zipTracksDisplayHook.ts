import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from './addTrackToMap.ts';
import { getShowCalculatedTracks, getShowMapMarker } from '../../../store/map.reducer.ts';
import { getSelectedVersions, getZipTracks } from '../../../store/zipTracks.reducer.ts';

export function zipTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const zipTracks = useSelector(getZipTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const showMarker = useSelector(getShowMapMarker);
    const selectedVersions = useSelector(getSelectedVersions);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const tracks = selectedVersions.flatMap((version) => {
            return zipTracks[version] ?? [];
        });
        addTracksToLayer(calculatedTracksLayer, tracks, showTracks, {
            showMarker,
            opacity: 0.7,
        });
    }, [zipTracks, zipTracks.length, selectedVersions, showMarker]);
}

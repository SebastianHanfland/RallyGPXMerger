import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getFilteredCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { addTracksToLayer } from '../../../common/map/addTrackToMapLayer.ts';
import { getHighlightedSegmentId, getShowCalculatedTracks, getShowMapMarker } from '../../store/map.reducer.ts';
import { getParsedTracks } from '../../store/parsedTracks.reducer.ts';

export function calculatedTracksDisplayHook(calculatedTracksLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getFilteredCalculatedTracks);
    const parsedTracks = useSelector(getParsedTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const showMarker = useSelector(getShowMapMarker);
    const highlightedSegmentId = useSelector(getHighlightedSegmentId);
    const filteredCalculatedTrackIds = calculatedTracks.map(({ id }) => id);
    const filteredParsedTracks = parsedTracks?.filter(({ id }) => filteredCalculatedTrackIds.includes(id)) ?? [];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(calculatedTracksLayer, filteredParsedTracks, Boolean(showTracks), {
            showMarker: Boolean(showMarker),
            opacity: highlightedSegmentId ? 0.2 : 0.7,
            onlyShowBreaks: true,
        });
    }, [filteredParsedTracks, filteredParsedTracks.length, showTracks, showMarker, highlightedSegmentId]);
}

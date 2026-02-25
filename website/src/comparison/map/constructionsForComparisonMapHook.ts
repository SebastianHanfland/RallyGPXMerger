import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { addTracksToLayer } from '../../common/map/addTrackToMapLayer.ts';
import { getShowComparisonMapConstructions } from '../store/map.reducer.ts';
import { getComparisonMapConstructions } from '../store/tracks.reducer.ts';

export function constructionsForComparisonMapHook(constructionLayer: MutableRefObject<LayerGroup | null>) {
    const constructions = useSelector(getComparisonMapConstructions);
    const showConstructions = useSelector(getShowComparisonMapConstructions) ?? false;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addTracksToLayer(constructionLayer, constructions, showConstructions, {
            showMarker: false,
            color: 'red',
        });
    }, [constructions, constructions.length, showConstructions]);
}

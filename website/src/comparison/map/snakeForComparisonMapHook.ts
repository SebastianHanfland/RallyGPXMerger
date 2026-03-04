import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getComparisonParsedTracks, getSelectedTracks, getSelectedVersions } from '../store/tracks.reducer.ts';
import { getBikeSnakesForComparisonMap, getCurrentComparisonTimeStamps } from './dataReading.ts';
import { addBikeSnakesToLayer } from '../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForComparisonMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const comparisonParsedTracks = useSelector(getComparisonParsedTracks);
    const currentMapTime = useSelector(getCurrentComparisonTimeStamps);
    const selectedTracks = useSelector(getSelectedTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const pointsToDisplay = useSelector(getBikeSnakesForComparisonMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay, true);
    }, [comparisonParsedTracks, currentMapTime, selectedTracks, selectedVersions]);
}

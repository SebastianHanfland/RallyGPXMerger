import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/zipTracks.reducer.ts';
import { getBikeSnakesForDisplayMap, getDisplayTimeStamp } from './dataReading.ts';
import { addBikeSnakesToLayer } from '../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForDisplayMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const zipTracks = useSelector(getZipTracks);
    const currentMapTime = useSelector(getDisplayTimeStamp);
    const selectedTracks = useSelector(getSelectedTracks);
    const selectedVersions = useSelector(getSelectedVersions);
    const pointsToDisplay = useSelector(getBikeSnakesForDisplayMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay, true);
    }, [zipTracks, currentMapTime, selectedTracks, selectedVersions]);
}

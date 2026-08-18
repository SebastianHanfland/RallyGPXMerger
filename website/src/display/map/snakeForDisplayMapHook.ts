import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';
import { getBikeSnakesForDisplayMap, getDisplayTimeStamp } from './dataReading.ts';
import { addBikeSnakesToLayer } from '../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForDisplayMapHook(snakeLayer: RefObject<LayerGroup | null>) {
    const displayTracks = useSelector(getDisplayTracks);
    const currentMapTime = useSelector(getDisplayTimeStamp);
    const pointsToDisplay = useSelector(getBikeSnakesForDisplayMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay, true);
    }, [displayTracks, currentMapTime]);
}

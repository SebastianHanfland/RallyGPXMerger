import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getParsedTracks } from '../store/displayTracksReducer.ts';
import { getBikeSnakesForDisplayMap, getDisplayTimeStamp } from './dataReading.ts';
import { addBikeSnakesToLayer } from '../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForDisplayMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const parsedTracks = useSelector(getParsedTracks);
    const currentMapTime = useSelector(getDisplayTimeStamp);
    const pointsToDisplay = useSelector(getBikeSnakesForDisplayMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay, true);
    }, [parsedTracks, currentMapTime]);
}

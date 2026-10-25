import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getDisplayTracks } from '../store/displayTracksReducer';
import { getBikeSnakesForDisplayMap, getDisplayTimeStamp } from './dataReading';
import { addBikeSnakesToLayer } from '../../common/map/addSnakeWithBikeToMap';

export function snakeForDisplayMapHook(snakeLayer: RefObject<LayerGroup | null>) {
    const displayTracks = useSelector(getDisplayTracks);
    const currentMapTime = useSelector(getDisplayTimeStamp);
    const pointsToDisplay = useSelector(getBikeSnakesForDisplayMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay);
    }, [displayTracks, currentMapTime]);
}

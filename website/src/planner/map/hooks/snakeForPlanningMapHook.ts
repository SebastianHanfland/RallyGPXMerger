import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getCurrenMapTime, getShowCalculatedTracks } from '../../store/map.reducer.ts';
import { getBikeSnakesForPlanningMap } from './trackSimulationReader.ts';
import { addBikeSnakesToLayer } from '../../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForPlanningMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const showTracks = useSelector(getShowCalculatedTracks) ?? false;
    const currentMapTime = useSelector(getCurrenMapTime);
    const snakesToDisplay = useSelector(getBikeSnakesForPlanningMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, snakesToDisplay, showTracks);
    }, [calculatedTracks, showTracks, currentMapTime]);
}

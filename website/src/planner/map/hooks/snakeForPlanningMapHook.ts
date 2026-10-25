import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCurrenMapTime } from '../../store/map.reducer';
import { getBikeSnakesForPlanningMap } from './trackSimulationReader';
import { addBikeSnakesToLayer } from '../../../common/map/addSnakeWithBikeToMap';
import { CalculatedTrack } from '../../../common/types';
import { getFilteredCalculatedTracks } from '../../store/calculatedTracks.reducer';

export function snakeForPlanningMapHook(snakeLayer: RefObject<LayerGroup | null>) {
    const calculatedTracks: CalculatedTrack[] = useSelector(getFilteredCalculatedTracks);

    const currentMapTime = useSelector(getCurrenMapTime);
    const snakesToDisplay = useSelector(getBikeSnakesForPlanningMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, snakesToDisplay);
    }, [calculatedTracks, currentMapTime, snakesToDisplay]);
}

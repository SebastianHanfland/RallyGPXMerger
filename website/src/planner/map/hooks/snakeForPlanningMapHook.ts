import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getCurrenMapTime, getShowCalculatedTracks } from '../../store/map.reducer.ts';
import { getCurrentMarkerPositionsForTracks } from './trackSimulationReader.ts';
import { addBikeSnakesToLayer } from '../../../common/map/addSnakeWithBikeToMap.ts';

export function snakeForPlanningMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const showTracks = useSelector(getShowCalculatedTracks);
    const currentMapTime = useSelector(getCurrenMapTime);
    const pointsToDisplay = useSelector(getCurrentMarkerPositionsForTracks);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, pointsToDisplay, showTracks);
    }, [calculatedTracks, showTracks, currentMapTime]);
}

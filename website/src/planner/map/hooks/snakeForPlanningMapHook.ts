import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import { LayerGroup } from 'leaflet';
import { getCurrenMapTime, getShowCalculatedTracks } from '../../store/map.reducer.ts';
import { getBikeSnakesForPlanningMap } from './trackSimulationReader.ts';
import { addBikeSnakesToLayer } from '../../../common/map/addSnakeWithBikeToMap.ts';
import { CalculatedTrack } from '../../../common/types.ts';
import { getCalculateTracks } from '../../calculation/getCalculatedTracks.ts';

export function snakeForPlanningMapHook(snakeLayer: MutableRefObject<LayerGroup | null>) {
    const calculatedTracks: CalculatedTrack[] = useSelector(getCalculateTracks);

    const showTracks = useSelector(getShowCalculatedTracks) ?? false;
    const currentMapTime = useSelector(getCurrenMapTime);
    const snakesToDisplay = useSelector(getBikeSnakesForPlanningMap);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        addBikeSnakesToLayer(snakeLayer, snakesToDisplay, showTracks);
    }, [calculatedTracks, showTracks, currentMapTime]);
}

import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getPointToCenter, mapActions } from '../../store/map.reducer.ts';

export function moveCenterPointHook(map: L.Map | undefined) {
    const pointToCenter = useSelector(getPointToCenter);
    const dispatch = useDispatch();

    useEffect(() => {
        if (pointToCenter && map) {
            const { lat, lon, zoom } = pointToCenter;
            map.setView({ lat: lat, lng: lon }, zoom);
            dispatch(mapActions.setPointToCenter(undefined));
        }
    }, [pointToCenter]);
}

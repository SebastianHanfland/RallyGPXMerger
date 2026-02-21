import { useEffect, useState } from 'react';
import L, { LayerGroup } from 'leaflet';
import { fetchCriticalMapsLocation } from './criticalMapsLocationsApi.ts';
import { blueBike } from '../../common/map/MapIcons.ts';
import { useSelector } from 'react-redux';
import { getIsLive } from '../store/map.reducer.ts';

const EVERY_MINUTE = 60 * 1000;
const convertToCoord = (latitude: number) => {
    return latitude / 1000000;
};

export let bikeCounterMirror = 0;

export const criticalMapsHook = (criticalMapsLayer: React.MutableRefObject<LayerGroup | null>) => {
    const [fetchCounter, setFetchCounter] = useState(0);
    const [bikeCounter, setBikeCounter] = useState(0);
    const isLive = useSelector(getIsLive);

    useEffect(() => {
        if (isLive) {
            setInterval(() => {
                setFetchCounter(Date.now);
            }, EVERY_MINUTE / 3);
        }
    }, []);

    useEffect(() => {
        if (!isLive) {
            return;
        }
        const current = criticalMapsLayer.current;

        if (!criticalMapsLayer || !current) {
            return;
        }
        current.clearLayers();

        fetchCriticalMapsLocation().then((locations) => {
            setBikeCounter(locations.length);
            locations.forEach((location) => {
                const point = L.marker(
                    {
                        lat: convertToCoord(location.latitude),
                        lng: convertToCoord(location.longitude),
                    },
                    { icon: blueBike }
                );
                point.addTo(current);
            });
        });
    }, [fetchCounter]);
    bikeCounterMirror = bikeCounter;
};

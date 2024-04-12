import { MutableRefObject, useEffect, useState } from 'react';
import L, { LayerGroup } from 'leaflet';
import { fetchCriticalMapsLocation } from './criticalMapsLocationsApi.ts';
import { CriticalMapsLocation } from './types.ts';
import { isLive } from '../ZipTimeSlider.tsx';
import { blueBike } from '../../common/MapIcons.ts';

const EVERY_MINUTE = 60 * 1000;
const convertToCoord = (latitude: number) => {
    return latitude / 1000000;
};

const NortWestOfAugsburg = { lat: 48368052, lng: 11395999 };
const SouthEastOfRosenheim = { lat: 48036715, lng: 11740695 };

const filterCoordinatesAroundMunich = (locations: CriticalMapsLocation[]): CriticalMapsLocation[] => {
    return locations.filter(
        (location) =>
            location.latitude <= NortWestOfAugsburg.lat &&
            location.latitude >= SouthEastOfRosenheim.lat &&
            location.longitude >= NortWestOfAugsburg.lng &&
            location.longitude <= SouthEastOfRosenheim.lng
    );
};

export const criticalMapsHook = (criticalMapsLayer: MutableRefObject<LayerGroup | null>) => {
    const [fetchCounter, setFetchCounter] = useState(0);

    useEffect(() => {
        if (isLive) {
            setInterval(() => {
                setFetchCounter(fetchCounter + 1);
            }, EVERY_MINUTE / 2);
        }
    }, []);

    useEffect(() => {
        const current = criticalMapsLayer.current;

        if (!criticalMapsLayer || !current) {
            return;
        }
        current.clearLayers();

        fetchCriticalMapsLocation().then((locations) => {
            filterCoordinatesAroundMunich(locations).forEach((location) => {
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
};

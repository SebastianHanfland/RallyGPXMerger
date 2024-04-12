import { useEffect, useState } from 'react';
import L, { LayerGroup } from 'leaflet';
import { fetchCriticalMapsLocation } from './criticalMapsLocationsApi.ts';
import { CriticalMapsLocation } from './types.ts';
import { isLive } from '../ZipTimeSlider.tsx';
import { blueBike } from '../../common/MapIcons.ts';

const EVERY_MINUTE = 60 * 1000;
const convertToCoord = (latitude: number) => {
    return latitude / 1000000;
};

const NortWestOfAugsburg = { lat: 48468052, lng: 10735999 };
const SouthEastOfRosenheim = { lat: 47776715, lng: 12240695 };

const filterCoordinatesAroundMunich = (locations: CriticalMapsLocation[]): CriticalMapsLocation[] => {
    return locations.filter(
        (location) =>
            location.latitude <= NortWestOfAugsburg.lat &&
            location.latitude >= SouthEastOfRosenheim.lat &&
            location.longitude >= NortWestOfAugsburg.lng &&
            location.longitude <= SouthEastOfRosenheim.lng
    );
};

export let bikeCounterMirror = 0;

export const criticalMapsHook = (criticalMapsLayer: React.MutableRefObject<LayerGroup | null>) => {
    const [fetchCounter, setFetchCounter] = useState(0);
    const [bikeCounter, setBikeCounter] = useState(0);

    useEffect(() => {
        if (isLive) {
            setInterval(() => {
                setFetchCounter(Date.now);
            }, EVERY_MINUTE / 3);
        }
    }, []);

    useEffect(() => {
        const current = criticalMapsLayer.current;

        if (!criticalMapsLayer || !current) {
            return;
        }
        current.clearLayers();

        fetchCriticalMapsLocation().then((locations) => {
            const bikesAroundMunich = filterCoordinatesAroundMunich(locations);
            setBikeCounter(bikesAroundMunich.length);
            bikesAroundMunich.forEach((location) => {
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

        L.rectangle(
            [
                [NortWestOfAugsburg.lat / 1000000, NortWestOfAugsburg.lng / 1000000],
                [SouthEastOfRosenheim.lat / 1000000, SouthEastOfRosenheim.lng / 1000000],
            ],
            { fill: false }
        ).addTo(current);
    }, [fetchCounter]);
    bikeCounterMirror = bikeCounter;
};

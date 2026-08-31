import L, { LayerGroup } from 'leaflet';
import { bikeIcon } from './MapIcons.ts';
import { RefObject } from 'react';

export interface BikeSnake {
    points: { lat: number; lng: number }[];
    color: string;
    id: string;
    title: string;
}

function addSnakeToLayer(snake: BikeSnake, routeLayer: LayerGroup) {
    const points = snake.points;
    const color = snake.color;
    const title = snake.title;

    if (points.length === 0) {
        return;
    }

    const trackMarker = L.marker(points[points.length - 1], {
        icon: bikeIcon,
        title,
    });
    const enhancedPoints = points.length === 1 ? [points[0], points[0]] : points;
    const trackSnake = L.polyline(enhancedPoints, { weight: 20, color, opacity: 1 });

    trackMarker.addTo(routeLayer);
    trackSnake.addTo(routeLayer);
}

export function addBikeSnakesToLayer(mapLayer: RefObject<LayerGroup | null>, bikeSnakes: BikeSnake[]) {
    const current = mapLayer.current;

    if (!mapLayer || !current) {
        return;
    }
    current.clearLayers();
    bikeSnakes.forEach((snake) => {
        addSnakeToLayer(snake, current);
    });
}

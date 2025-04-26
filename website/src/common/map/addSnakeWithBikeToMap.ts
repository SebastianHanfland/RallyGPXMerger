import L, { LayerGroup } from 'leaflet';
import { bikeIcon } from '../MapIcons.ts';

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
    const trackMarker = L.marker(points.reverse()[0], {
        icon: bikeIcon,
        title,
    });
    const enhancedPoints = points.length === 1 ? [points[0], points[0]] : points;
    const trackSnake = L.polyline(enhancedPoints, { weight: 20, color, opacity: 1 });

    trackMarker.addTo(routeLayer);
    trackSnake.addTo(routeLayer);
}

export function addBikeSnakesToLayer(
    mapLayer: React.MutableRefObject<LayerGroup | null>,
    bikeSnakes: BikeSnake[],
    show: boolean
) {
    const current = mapLayer.current;

    if (!mapLayer || !current) {
        return;
    }
    current.clearLayers();
    if (!show) {
        return;
    }
    bikeSnakes.forEach((snake) => {
        addSnakeToLayer(snake, current);
    });
}

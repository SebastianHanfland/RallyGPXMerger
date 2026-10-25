import L from 'leaflet';
import { PointOfInterest } from '../../planner/store/types';
import { pointOfInterestConfig } from '../../planner/points/pointOfInterestConfig';
import { wcIcon } from './MapIcons';

export function createPointOfInterestMarker(point: PointOfInterest): L.Circle | L.Marker {
    const config = pointOfInterestConfig[point.type];
    if (config.mapShape === 'toilet') {
        return L.marker(point, { icon: wcIcon });
    }
    return L.circle(point, { radius: point.radiusInM, color: config.color });
}

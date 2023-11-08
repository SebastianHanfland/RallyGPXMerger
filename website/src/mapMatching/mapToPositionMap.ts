import { GeoApifyLeg, GeoApifyMapMatchingResult, GeoApifyWayPoint } from './types.ts';
import { ResolvedPositions } from '../store/types.ts';
import { toKey } from './initializeResolvedPositions.ts';

function resolveWayPoint(legInfo: GeoApifyLeg[], resolvedPositions: ResolvedPositions) {
    return ({ leg_index, step_index, original_location }: GeoApifyWayPoint) => {
        const geoApifyLegStep = legInfo[leg_index].steps[step_index];
        const positionKey = toKey({ lat: original_location[1], lon: original_location[0] });
        resolvedPositions[positionKey] = geoApifyLegStep.name ?? 'Unknown';
    };
}

export function mapToPositionMap(result: GeoApifyMapMatchingResult): ResolvedPositions {
    const resolvedPositions: ResolvedPositions = {};
    result.features.forEach((feature) => {
        const legInfo = feature.properties.legs;
        feature.properties.waypoints
            .filter((waypoint) => waypoint.match_type !== 'unmatched')
            .forEach(resolveWayPoint(legInfo, resolvedPositions));
    });
    return resolvedPositions;
}

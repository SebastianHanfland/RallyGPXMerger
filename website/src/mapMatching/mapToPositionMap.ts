import { GeoApifyMapMatchingResult } from './types.ts';
import { ResolvePositions } from '../store/types.ts';
import { toKey } from '../reverseGeoCoding/initializeResolvedPositions.ts';

export function mapToPositionMap(result: GeoApifyMapMatchingResult): ResolvePositions {
    const resolvedPositions: ResolvePositions = {};
    result.features.forEach((feature) => {
        const legInfo = feature.properties.legs;
        feature.properties.waypoints.forEach(({ leg_index, step_index, original_location }) => {
            const geoApifyLegStep = legInfo[leg_index].steps[step_index];
            const positionKey = toKey({ lat: original_location[0], lon: original_location[1] });
            resolvedPositions[positionKey] = geoApifyLegStep.name ?? 'Unknown';
        });
    });
    return resolvedPositions;
}

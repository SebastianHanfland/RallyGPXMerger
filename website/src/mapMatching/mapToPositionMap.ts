import { GeoApifyLeg, GeoApifyMapMatchingResult, GeoApifyWayPoint } from './types.ts';
import { ResolvedPositions } from '../store/types.ts';
import { toKey } from './initializeResolvedPositions.ts';

const alternatives = [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5];

function resolveWayPoint(legInfo: GeoApifyLeg[], resolvedPositions: ResolvedPositions) {
    return ({ leg_index, step_index, original_location }: GeoApifyWayPoint) => {
        const positionKey = toKey({ lat: original_location[1], lon: original_location[0] });

        let streetName = legInfo[leg_index].steps[step_index].name;
        let alternativeCounter = 0;
        while (streetName === undefined && alternativeCounter < alternatives.length) {
            const alternativeStep = step_index + alternatives[alternativeCounter];
            if (alternativeStep >= 0 && alternativeStep < legInfo[leg_index].steps.length) {
                streetName = legInfo[leg_index].steps[alternativeStep].name;
            }
            alternativeCounter++;
        }
        resolvedPositions[positionKey] = streetName ?? 'Unknown';
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

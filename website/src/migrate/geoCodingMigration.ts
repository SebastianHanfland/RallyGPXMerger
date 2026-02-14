import { GeoCodingStateOld } from '../planner/store/typesOld.ts';
import { GeoCodingState } from '../planner/store/types.ts';

export function migrateGeoCoding(geoCoding: GeoCodingStateOld): GeoCodingState {
    return {
        bigDataCloudKey: geoCoding.bigDataCloudKey,
        geoApifyKey: geoCoding.geoApifyKey,
        districtReplacementWayPoints: geoCoding.districtReplacementWayPoints,
        streetReplacementWayPoints: geoCoding.streetReplacementWayPoints,
        onlyShowUnknown: geoCoding.onlyShowUnknown,
    };
}

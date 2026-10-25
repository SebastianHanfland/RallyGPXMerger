import { GeoCodingStateOld } from '../planner/store/typesOld';
import { GeoCodingState } from '../planner/store/types';

export function migrateGeoCoding(geoCoding: GeoCodingStateOld): GeoCodingState {
    return {
        bigDataCloudKey: geoCoding.bigDataCloudKey,
        geoApifyKey: geoCoding.geoApifyKey,
        onlyShowUnknown: geoCoding.onlyShowUnknown,
    };
}

import stateVersion1 from './stateVersion1.json';
import { migrateVersion1To2 } from '../migrateVersion1To2.ts';
import { StateOld } from '../../planner/store/typesOld.ts';

describe('test merging of gpx file', () => {
    it('Should make a simple merge without people', () => {
        // given
        const oldState: StateOld = stateVersion1 as StateOld;

        // when
        const state = migrateVersion1To2(oldState);

        // then
        expect(state.segmentData.segments).toHaveLength(oldState.gpxSegments.segments.length);
    });
});

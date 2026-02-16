import stateVersion1 from './stateVersion1.json';
import { migrateVersion1To2 } from '../migrateVersion1To2.ts';
import { StateOld } from '../../planner/store/typesOld.ts';
import { getCalculatedTracks } from '../../planner/store/calculatedTracks.reducer.ts';

describe('test migration', () => {
    it('testing segment data', () => {
        // given
        const oldState: StateOld = stateVersion1 as StateOld;

        // when
        const state = migrateVersion1To2(oldState);

        // then SegmentData
        expect(state.segmentData.segments).toHaveLength(oldState.gpxSegments.segments.length);
        expect(state.segmentData.streetLookup).toEqual({
            '1': 'Orthstraße',
            '1001': 'Chopinstraße',
            '2001': 'Orthstraße',
        });
        expect(state.segmentData.districtLookup).toEqual({
            '1': 'München',
            '1001': 'München',
            '2001': 'München',
        });
        expect(state.segmentData.postCodeLookup).toEqual({
            '1': '81245',
            '1001': '81245',
            '2001': '81245',
        });
        expect(state.segmentData.segmentSpeeds).toEqual(oldState.gpxSegments.segmentSpeeds);
        expect(state.segmentData.segments[0].points[0].t).toEqual(0);
    });

    it('testing calculated tracks', () => {
        // given
        const oldState: StateOld = stateVersion1 as StateOld;

        // when
        const state = migrateVersion1To2(oldState);

        // then SegmentData
        const calculatedTracks = getCalculatedTracks(state);
        expect(calculatedTracks).toHaveLength(oldState.calculatedTracks.tracks.length);
        // TODO: check that calculated tracks exist
    });
});

import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../planningStore.ts';
import {
    getDistrictLookup,
    getFixedSegmentSpeeds,
    getParsedGpxSegments,
    getPostCodeLookup,
    getSegmentSortDirection,
    getSegmentSortField,
    getSegmentUsageFilter,
    getStreetLookup,
    segmentDataActions,
} from '../segmentData.redux.ts';

describe('segmentData reducer', () => {
    it('stores segment table sorting and usage filter preferences', () => {
        const store = createPlanningStore();

        expect(getSegmentSortField(store.getState())).toBe('name');
        expect(getSegmentSortDirection(store.getState())).toBe('ascending');
        expect(getSegmentUsageFilter(store.getState())).toBe('all');

        store.dispatch(segmentDataActions.toggleSegmentSort('distance'));
        expect(getSegmentSortField(store.getState())).toBe('distance');
        expect(getSegmentSortDirection(store.getState())).toBe('ascending');
        store.dispatch(segmentDataActions.toggleSegmentSort('distance'));
        expect(getSegmentSortDirection(store.getState())).toBe('descending');
        store.dispatch(segmentDataActions.toggleSegmentSort('speed'));
        expect(getSegmentSortField(store.getState())).toBe('speed');
        expect(getSegmentSortDirection(store.getState())).toBe('ascending');

        store.dispatch(segmentDataActions.cycleSegmentUsageFilter());
        expect(getSegmentUsageFilter(store.getState())).toBe('used');
        store.dispatch(segmentDataActions.cycleSegmentUsageFilter());
        expect(getSegmentUsageFilter(store.getState())).toBe('unused');
        store.dispatch(segmentDataActions.cycleSegmentUsageFilter());
        expect(getSegmentUsageFilter(store.getState())).toBe('all');
    });

    it('stores fixed speed mode and recalculates using fixed velocity', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: 'segment',
                    filename: 'segment',
                    points: [
                        { b: 1, l: 1, e: 0, t: 0, s: -1 },
                        { b: 1, l: 1.01, e: 1000, t: 0, s: -1 },
                    ],
                },
            ])
        );

        store.dispatch(
            segmentDataActions.setSegmentSpeeds({ id: 'segment', speed: 20, averageSpeed: 20, fixedVelocity: true })
        );

        expect(getFixedSegmentSpeeds(store.getState())).toEqual({ segment: true });
        expect(getParsedGpxSegments(store.getState())[0]!.points[1]!.t).toBeGreaterThan(0);

        store.dispatch(segmentDataActions.setSegmentSpeeds({ id: 'segment', speed: 20, averageSpeed: 20 }));
        expect(getFixedSegmentSpeeds(store.getState())).toEqual({ segment: false });
    });

    it('preserves lookup rows referenced by manual point indexes when clearing resolved data', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                { id: 'segment', filename: 'segment', points: [{ b: 1, l: 1, e: 0, t: 0, s: 1, m: 10 }] },
            ])
        );
        store.dispatch(segmentDataActions.addStreetLookup({ 1: 'API Street', 10: 'Manual Street' }));
        store.dispatch(segmentDataActions.addPostCodeLookup({ 1: '11111', 10: '22222' }));
        store.dispatch(segmentDataActions.addDistrictLookup({ 1: 'API District', 10: 'Manual District' }));

        store.dispatch(segmentDataActions.clearResolvedStreetData());

        expect(getStreetLookup(store.getState())).toEqual({ 10: 'Manual Street' });
        expect(getPostCodeLookup(store.getState())).toEqual({ 10: '22222' });
        expect(getDistrictLookup(store.getState())).toEqual({ 10: 'Manual District' });
    });

    it('creates a new manual lookup row and assigns its index to matching points', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: 'segment',
                    filename: 'segment',
                    points: [
                        { b: 1, l: 1, e: 0, t: 0, s: 7 },
                        { b: 2, l: 2, e: 0, t: 1, s: 7 },
                        { b: 3, l: 3, e: 0, t: 2, s: 8 },
                    ],
                },
            ])
        );
        store.dispatch(segmentDataActions.addStreetLookup({ 7: 'API Street' }));
        store.dispatch(segmentDataActions.addPostCodeLookup({ 7: '12345' }));
        store.dispatch(segmentDataActions.addDistrictLookup({ 7: 'Old District' }));

        store.dispatch(
            segmentDataActions.applyManualLookup({ sourceIndex: 7, field: 'street', value: 'Manual Street' })
        );

        const segment = getParsedGpxSegments(store.getState())[0]!;
        expect(segment.points.map(({ s, m }) => (m === undefined ? { s } : { s, m }))).toEqual([
            { s: 7, m: 9 },
            { s: 7, m: 9 },
            { s: 8 },
        ]);
        expect(getStreetLookup(store.getState())[9]).toBe('Manual Street');
        expect(getPostCodeLookup(store.getState())[9]).toBe('12345');
        expect(getDistrictLookup(store.getState())[9]).toBe('Old District');
    });

    it('updates manual street ranges without changing automatic indexes', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: 'segment',
                    filename: 'segment',
                    points: [
                        { b: 1, l: 1, e: 0, t: 0, s: 4 },
                        { b: 2, l: 2, e: 0, t: 1, s: 5 },
                    ],
                },
            ])
        );
        store.dispatch(
            segmentDataActions.applyStreetRangeAssignments([
                { segmentId: 'segment', pointIndex: 0, lookupIndex: 'unknown-start' },
                { segmentId: 'segment', pointIndex: 1, lookupIndex: 5 },
            ])
        );

        const points = getParsedGpxSegments(store.getState())[0]!.points;
        expect(points.map(({ s, m }) => ({ s, m }))).toEqual([
            { s: 4, m: 6 },
            { s: 5, m: 5 },
        ]);
        expect(getStreetLookup(store.getState())[6]).toBeUndefined();
        expect(getPostCodeLookup(store.getState())[6]).toBeUndefined();
        expect(getDistrictLookup(store.getState())[6]).toBeUndefined();
    });
});

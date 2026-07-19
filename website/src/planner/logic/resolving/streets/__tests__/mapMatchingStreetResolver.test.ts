import { createPlanningStore } from '../../../../store/planningStore.ts';
import { enrichGpxSegmentsWithStreetNames } from '../mapMatchingStreetResolver.ts';
import { dummySegment } from './dummySegment.ts';
import { geoApifyResponse } from './dummyResponse.ts';
import { getParsedGpxSegments, getStreetLookup, segmentDataActions } from '../../../../store/segmentData.redux.ts';
import { Mock } from 'vitest';
import { trackMergeActions, getTrackCompositions } from '../../../../store/trackMerge.reducer.ts';
import { SEGMENT } from '../../../../store/types.ts';
import { executeGpxSegmentReplacementWithUpload } from '../../../../segments/fileReplaceWithUploadThunk.ts';

// @ts-ignore
global.fetch = vi.fn();

describe('mapMatchingStreetResolver', () => {
    it('enrichOneGpxSegment', async () => {
        // when
        const planningStore = createPlanningStore();
        (fetch as Mock).mockResolvedValue({ json: () => new Promise((resolve) => resolve(geoApifyResponse)) });

        await planningStore.dispatch(enrichGpxSegmentsWithStreetNames([dummySegment]));

        // then
        const streetLookup = getStreetLookup(planningStore.getState());
        expect(Object.keys(streetLookup).length).toEqual(10);
        const segments = getParsedGpxSegments(planningStore.getState());
        segments;
    });

    it('reserves distinct lookup indexes for overlapping asynchronous resolutions', async () => {
        const planningStore = createPlanningStore();
        let resolveFirstResponse: (value: typeof geoApifyResponse) => void;
        let resolveSecondResponse: (value: typeof geoApifyResponse) => void;
        const firstResponse = new Promise<typeof geoApifyResponse>((resolve) => {
            resolveFirstResponse = resolve;
        });
        const secondResponse = new Promise<typeof geoApifyResponse>((resolve) => {
            resolveSecondResponse = resolve;
        });
        (fetch as Mock)
            .mockResolvedValueOnce({ json: () => firstResponse })
            .mockResolvedValueOnce({ json: () => secondResponse });

        const firstSegment = { ...dummySegment, id: 'first-segment' };
        const secondSegment = { ...dummySegment, id: 'second-segment', filename: 'second-segment' };

        const firstResolution = planningStore.dispatch(enrichGpxSegmentsWithStreetNames([firstSegment]));
        const secondResolution = planningStore.dispatch(enrichGpxSegmentsWithStreetNames([secondSegment]));

        resolveSecondResponse!(geoApifyResponse);
        resolveFirstResponse!(geoApifyResponse);
        await Promise.all([firstResolution, secondResolution]);

        const resolvedSegments = getParsedGpxSegments(planningStore.getState());
        const firstIndexes = new Set(
            resolvedSegments.find((segment) => segment.id === firstSegment.id)!.points.map((p) => p.s)
        );
        const secondIndexes = new Set(
            resolvedSegments.find((segment) => segment.id === secondSegment.id)!.points.map((p) => p.s)
        );

        expect([...firstIndexes].filter((index) => secondIndexes.has(index))).toEqual([]);
    });

    it('keeps a newly resolved replacement segment connected to its own lookup entries', async () => {
        const planningStore = createPlanningStore();
        (fetch as Mock).mockResolvedValue({ json: () => Promise.resolve(geoApifyResponse) });
        const originalSegment = { ...dummySegment, id: 'original-segment' };
        const replacementSegment = { ...dummySegment, id: 'replacement-segment', filename: 'replacement-segment' };

        await planningStore.dispatch(enrichGpxSegmentsWithStreetNames([originalSegment]));
        await planningStore.dispatch(enrichGpxSegmentsWithStreetNames([replacementSegment]));
        planningStore.dispatch(
            trackMergeActions.addTrackComposition({
                id: 'track',
                name: 'Track',
                segments: [{ id: originalSegment.id, segmentId: originalSegment.id, type: SEGMENT }],
            })
        );
        planningStore.dispatch(
            segmentDataActions.setReplaceProcess({
                targetSegment: originalSegment.id,
                replacementSegments: [replacementSegment],
            })
        );

        planningStore.dispatch(executeGpxSegmentReplacementWithUpload);

        const replacement = getParsedGpxSegments(planningStore.getState()).find(
            (segment) => segment.id === replacementSegment.id
        )!;
        const replacementIndexes = new Set(replacement.points.map((point) => point.s));
        const streetLookup = getStreetLookup(planningStore.getState());

        expect(getParsedGpxSegments(planningStore.getState()).map((segment) => segment.id)).toEqual([
            replacementSegment.id,
        ]);
        expect(getTrackCompositions(planningStore.getState())[0].segments).toEqual([
            { id: replacementSegment.id, segmentId: replacementSegment.id, type: SEGMENT },
        ]);
        expect(
            [...replacementIndexes].every((index) => Object.prototype.hasOwnProperty.call(streetLookup, index))
        ).toBe(true);
    });
});

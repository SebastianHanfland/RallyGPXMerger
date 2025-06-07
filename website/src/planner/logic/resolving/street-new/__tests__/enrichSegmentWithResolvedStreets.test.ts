import { enrichSegmentWithResolvedStreets } from '../enrichSegmentWithResolvedStreets.ts';
import { ParsedGpxSegment } from '../../../../new-store/types.ts';

describe('enrichSegmentWithResolvedStreets', () => {
    it('should correctly resolve one location', () => {
        // given
        const segmentWithoutStreets: ParsedGpxSegment = {
            points: [],
            filename: 'fname',
            id: '123',
            streetsResolved: false,
        };
        // when
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(segmentWithoutStreets, {}, 1);

        // then
        expect(segment.streetsResolved).toBeTruthy();
        expect(segment.filename).toEqual(segmentWithoutStreets.filename);
        expect(segment.id).toEqual(segmentWithoutStreets.id);
        expect(segment.points.length).toEqual(segmentWithoutStreets.points.length);

        expect(streetLookUp).toEqual({});
    });
});

import { createPlanningStore } from '../store/planningStore.ts';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { gpxA1Content, gpxABContent, gpxB1Content } from './gpxContents.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { Point } from '../../utils/gpxTypes.ts';

function getRelevantAttributes(startPointA: Point) {
    return { lat: startPointA.lat, lon: startPointA.lon, time: startPointA.time, ele: startPointA.ele };
}

function assertAdjustedTime(startPointA: Point, startPointA1: Point, time: string) {
    expect(getRelevantAttributes(startPointA)).toEqual(getRelevantAttributes({ ...startPointA1, time: time }));
}

describe('test merging of gpx file', () => {
    it('Should make a simple merge without people', () => {
        // given
        const store = createPlanningStore();
        store.dispatch(
            gpxSegmentsActions.addGpxSegments([
                { id: '1', content: gpxA1Content, filename: 'A1' },
                { id: '2', content: gpxB1Content, filename: 'B1' },
                { id: '3', content: gpxABContent, filename: 'AB' },
            ])
        );
        store.dispatch(trackMergeActions.addTrackComposition({ id: '1', segmentIds: ['1', '3'], name: 'A' }));
        store.dispatch(trackMergeActions.addTrackComposition({ id: '2', segmentIds: ['2', '3'], name: 'B' }));
        store.dispatch(trackMergeActions.setArrivalDateTime('2023-10-17T22:15:00.000Z'));

        store.dispatch(calculateMerge);

        const calculatedTracks = getCalculatedTracks(store.getState());
        expect(calculatedTracks).toHaveLength(2);

        const startPointA = SimpleGPX.fromString(calculatedTracks[0].content).getStartPoint();
        const startPointB = SimpleGPX.fromString(calculatedTracks[1].content).getStartPoint();
        const endPointA = SimpleGPX.fromString(calculatedTracks[0].content).getEndPoint();
        const endPointB = SimpleGPX.fromString(calculatedTracks[1].content).getEndPoint();
        const startPointA1 = SimpleGPX.fromString(gpxA1Content).getStartPoint();
        const startPointB1 = SimpleGPX.fromString(gpxB1Content).getStartPoint();
        const endPointAB = SimpleGPX.fromString(gpxABContent).getEndPoint();

        assertAdjustedTime(startPointA, startPointA1, '2023-10-17T22:13:54.240Z');
        assertAdjustedTime(startPointB, startPointB1, '2023-10-17T22:13:52.259Z');
        assertAdjustedTime(endPointA, endPointAB, '2023-10-17T22:15:00.000Z');
        assertAdjustedTime(endPointB, endPointAB, '2023-10-17T22:15:00.000Z');
    });

    it('Should make a simple merge with people', () => {
        // given
        const store = createPlanningStore();
        store.dispatch(
            gpxSegmentsActions.addGpxSegments([
                { id: '1', content: gpxA1Content, filename: 'A1' },
                { id: '2', content: gpxB1Content, filename: 'B1' },
                { id: '3', content: gpxABContent, filename: 'AB' },
            ])
        );
        store.dispatch(
            trackMergeActions.addTrackComposition({ id: '1', segmentIds: ['1', '3'], name: 'A', peopleCount: 100 })
        );
        store.dispatch(
            trackMergeActions.addTrackComposition({ id: '2', segmentIds: ['2', '3'], name: 'B', peopleCount: 200 })
        );
        store.dispatch(trackMergeActions.setArrivalDateTime('2023-10-17T22:15:00.000Z'));

        store.dispatch(calculateMerge);

        const calculatedTracks = getCalculatedTracks(store.getState());
        expect(calculatedTracks).toHaveLength(2);

        const startPointA = SimpleGPX.fromString(calculatedTracks[0].content).getStartPoint();
        const startPointB = SimpleGPX.fromString(calculatedTracks[1].content).getStartPoint();
        const endPointA = SimpleGPX.fromString(calculatedTracks[0].content).getEndPoint();
        const endPointB = SimpleGPX.fromString(calculatedTracks[1].content).getEndPoint();
        const startPointA1 = SimpleGPX.fromString(gpxA1Content).getStartPoint();
        const startPointB1 = SimpleGPX.fromString(gpxB1Content).getStartPoint();
        const endPointAB = SimpleGPX.fromString(gpxABContent).getEndPoint();

        assertAdjustedTime(startPointA, startPointA1, '2023-10-17T22:14:34.240Z');
        assertAdjustedTime(startPointB, startPointB1, '2023-10-17T22:13:52.259Z');
        assertAdjustedTime(endPointB, endPointAB, '2023-10-17T22:15:00.000Z');
        assertAdjustedTime(endPointA, endPointAB, '2023-10-17T22:15:40.000Z');
    });
});

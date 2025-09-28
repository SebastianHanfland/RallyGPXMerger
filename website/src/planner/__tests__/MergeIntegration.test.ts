import { createPlanningStore } from '../store/planningStore.ts';
import { gpxA1Content, gpxABContent, gpxB1Content } from './gpxContents.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { Point } from '../../utils/gpxTypes.ts';
import { segmentDataActions } from '../new-store/segmentData.redux.ts';
import { ParsedPoint, TimedPoint } from '../new-store/types.ts';

function timePointToPoint(timedPoint: TimedPoint): Point {
    return { lat: timedPoint.b, lon: timedPoint.l, ele: timedPoint.e, time: timedPoint.t };
}

function getRelevantAttributes(startPointA: Point) {
    return { lat: startPointA.lat, lon: startPointA.lon, time: startPointA.time, ele: startPointA.ele };
}

function assertAdjustedTime(startPointA: Point, startPointA1: Point, time: string) {
    expect(getRelevantAttributes(startPointA)).toEqual(getRelevantAttributes({ ...startPointA1, time: time }));
}

function getPointsFromGpxString(gpxString: string): ParsedPoint[] {
    return SimpleGPX.fromString(gpxString)
        .getPoints()
        .map((point) => ({ b: point.lat, l: point.lon, e: point.ele, t: -1, s: -1 }));
}

describe('test merging of gpx file', () => {
    it('Should make a simple merge without people', () => {
        // given
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: '1',
                    points: getPointsFromGpxString(gpxA1Content),
                    filename: 'A1',
                    streetsResolved: false,
                },
                {
                    id: '2',
                    points: getPointsFromGpxString(gpxB1Content),
                    filename: 'B1',
                    streetsResolved: false,
                },
                {
                    id: '3',
                    points: getPointsFromGpxString(gpxABContent),
                    filename: 'AB',
                    streetsResolved: false,
                },
            ])
        );
        store.dispatch(trackMergeActions.addTrackComposition({ id: '1', segmentIds: ['1', '3'], name: 'A' }));
        store.dispatch(trackMergeActions.addTrackComposition({ id: '2', segmentIds: ['2', '3'], name: 'B' }));
        store.dispatch(trackMergeActions.setArrivalDateTime('2023-10-17T22:15:00.000Z'));

        store.dispatch(calculateMerge);

        const calculatedTracks = getCalculatedTracks(store.getState());
        expect(calculatedTracks).toHaveLength(2);

        const pointsA = calculatedTracks[0].points;
        const pointsB = calculatedTracks[1].points;

        const startPointA = timePointToPoint(pointsA[0]);
        const startPointB = timePointToPoint(pointsB[0]);
        const endPointA = timePointToPoint(pointsA[pointsA.length - 1]);
        const endPointB = timePointToPoint(pointsB[pointsB.length - 1]);
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
            segmentDataActions.addGpxSegments([
                { id: '1', points: getPointsFromGpxString(gpxA1Content), filename: 'A1', streetsResolved: false },
                { id: '2', points: getPointsFromGpxString(gpxB1Content), filename: 'B1', streetsResolved: false },
                { id: '3', points: getPointsFromGpxString(gpxABContent), filename: 'AB', streetsResolved: false },
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

        const pointsA = calculatedTracks[0].points;
        const pointsB = calculatedTracks[1].points;

        const startPointA = timePointToPoint(pointsA[0]);
        const startPointB = timePointToPoint(pointsB[0]);
        const endPointA = timePointToPoint(pointsA[pointsA.length - 1]);
        const endPointB = timePointToPoint(pointsB[pointsB.length - 1]);
        const startPointA1 = SimpleGPX.fromString(gpxA1Content).getStartPoint();
        const startPointB1 = SimpleGPX.fromString(gpxB1Content).getStartPoint();
        const endPointAB = SimpleGPX.fromString(gpxABContent).getEndPoint();

        assertAdjustedTime(startPointA, startPointA1, '2023-10-17T22:14:34.240Z');
        assertAdjustedTime(startPointB, startPointB1, '2023-10-17T22:13:52.259Z');
        assertAdjustedTime(endPointB, endPointAB, '2023-10-17T22:15:00.000Z');
        assertAdjustedTime(endPointA, endPointAB, '2023-10-17T22:15:40.000Z');
    });
});

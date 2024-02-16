import { Dispatch } from '@reduxjs/toolkit';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { fileContentA1 } from '../../samples/sampleDataA1.ts';
import { fileContentB1 } from '../../samples/sampleDataB1.ts';
import { fileContentAB } from '../../samples/sampleDataAB.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mapActions } from '../store/map.reducer.ts';

export const loadSampleData = (dispatch: Dispatch) => {
    dispatch(gpxSegmentsActions.clearGpxSegments());
    dispatch(
        gpxSegmentsActions.addGpxSegments([
            { id: '05901e', filename: 'A1T.gpx', content: fileContentA1 },
            { id: 'e84546', filename: 'B1T.gpx', content: fileContentB1 },
            { id: 'f62bc0', filename: 'ABT.gpx', content: fileContentAB },
        ])
    );
    dispatch(trackMergeActions.clear());
    dispatch(
        trackMergeActions.addTrackComposition({
            id: 'dd91ed',
            name: 'A',
            segmentIds: ['05901e', 'f62bc0'],
            peopleCount: 2000,
        })
    );
    dispatch(
        trackMergeActions.addTrackComposition({
            id: '83e7c6',
            name: 'B',
            segmentIds: ['e84546', 'f62bc0'],
            peopleCount: 3000,
        })
    );
    dispatch(trackMergeActions.setArrivalDateTime('2024-05-05T14:00:00.000Z'));
    dispatch(calculatedTracksActions.removeCalculatedTracks());
    dispatch(mapActions.setShowGpxSegments(true));
};

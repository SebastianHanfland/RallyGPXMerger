import { Button } from 'react-bootstrap';
import fileUpload from '../assets/file-up.svg';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { fileContentA1 } from '../samples/sampleDataA1.ts';
import { fileContentB1 } from '../samples/sampleDataB1.ts';
import { fileContentAB } from '../samples/sampleDataAB.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';

export function LoadExampleDataButton() {
    const dispatch = useDispatch();
    const loadSampleData = () => {
        dispatch(gpxSegmentsActions.clearGpxSegments());
        dispatch(
            gpxSegmentsActions.addGpxSegments([
                { id: '05901e', peopleCountEnd: 2000, filename: 'A1T.gpx', content: fileContentA1 },
                { id: 'e84546', peopleCountEnd: 3000, filename: 'B1T.gpx', content: fileContentB1 },
                { id: 'f62bc0', filename: 'ABT.gpx', content: fileContentAB },
            ])
        );
        dispatch(trackMergeActions.clear());
        dispatch(trackMergeActions.addTrackComposition({ id: 'dd91ed', name: 'A', segmentIds: ['05901e', 'f62bc0'] }));
        dispatch(trackMergeActions.addTrackComposition({ id: '83e7c6', name: 'B', segmentIds: ['e84546', 'f62bc0'] }));
        dispatch(trackMergeActions.setArrivalDateTime('2024-05-05T14:00:00.000Z'));
        dispatch(calculatedTracksActions.removeCalculatedTracks());
    };

    return (
        <Button onClick={loadSampleData} title={'Load some example gpx segments and tracks. This removes other files'}>
            <img src={fileUpload} className="m-1" alt="open file" />
            Load sample data
        </Button>
    );
}

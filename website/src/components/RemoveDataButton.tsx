import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';

export function RemoveDataButton() {
    const dispatch = useDispatch();
    return (
        <Button
            variant="danger"
            title="Delete all GPX segments, track compositions and tracks"
            onClick={() => {
                dispatch(gpxSegmentsActions.clearGpxSegments());
                dispatch(trackMergeActions.clear());
                dispatch(calculatedTracksActions.removeCalculatedTracks());
                localStorage.clear();
            }}
        >
            Remove all data
        </Button>
    );
}

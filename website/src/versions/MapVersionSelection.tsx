import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShowCalculatedTracks, getShowGpxSegments, getShowMapMarker, mapActions } from '../store/map.reducer.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';

export function MapVersionSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const showCalculatedTracks = useSelector(getShowCalculatedTracks);
    const showGpxSegments = useSelector(getShowGpxSegments);
    const dispatch = useDispatch();
    const calculatedTracks = useSelector(getCalculatedTracks);
    return (
        <Form.Group>
            <Form className={'d-flex'}>
                <Form.Check
                    type={'checkbox'}
                    id={'segments'}
                    className={'m-3'}
                    label={'GPX'}
                    title={'GPX Segments'}
                    checked={showGpxSegments}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowGpxSegments(!showGpxSegments))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'tracks'}
                    className={'m-3'}
                    label={'Tracks'}
                    title={'Calculated Tracks'}
                    checked={showCalculatedTracks}
                    disabled={calculatedTracks.length === 0}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowCalculatedTracks(!showCalculatedTracks))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'marker'}
                    className={'m-3'}
                    label={'Marker'}
                    title={showMapMarker ? 'Hide marker' : 'Show marker'}
                    checked={showMapMarker}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                ></Form.Check>
            </Form>
        </Form.Group>
    );
}

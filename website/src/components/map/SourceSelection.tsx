import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapSource, getShowMapMarker, mapActions } from '../../store/map.reducer.ts';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
export function SourceSelection() {
    const mapSource = useSelector(getCurrenMapSource);
    const showMapMarker = useSelector(getShowMapMarker);
    const dispatch = useDispatch();
    const calculatedTracks = useSelector(getCalculatedTracks);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Form.Group>
            <Form className={'d-flex'}>
                <Form.Check
                    type={'checkbox'}
                    id={'segments'}
                    className={'m-3'}
                    label={'GPX'}
                    title={'GPX Segments'}
                    checked={mapSource === 'segments'}
                    readOnly
                    onClick={() => dispatch(mapActions.setSource('segments'))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'tracks'}
                    className={'m-3'}
                    label={'Tracks'}
                    title={'Calculated Tracks'}
                    checked={mapSource === 'tracks'}
                    disabled={calculatedTracks.length === 0}
                    readOnly
                    onClick={() => dispatch(mapActions.setSource('tracks'))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'blocked streets'}
                    className={'m-3'}
                    label={'Streets'}
                    title={'Blocked Streets'}
                    checked={mapSource === 'blocked streets'}
                    disabled={blockedStreetInfos.length === 0}
                    readOnly
                    onClick={() => dispatch(mapActions.setSource('blocked streets'))}
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

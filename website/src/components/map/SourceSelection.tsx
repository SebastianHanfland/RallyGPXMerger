import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapSource, mapActions } from '../../store/map.reducer.ts';
export function SourceSelection() {
    const mapSource = useSelector(getCurrenMapSource);
    const dispatch = useDispatch();
    return (
        <Form.Group>
            <h5>Source selection</h5>
            <Form>
                <Form.Check
                    type={'radio'}
                    id={'segments'}
                    className={'m-3'}
                    label={'GPX Segments'}
                    checked={mapSource === 'segments'}
                    readOnly
                    onClick={() => dispatch(mapActions.setSource('segments'))}
                ></Form.Check>
                <Form.Check
                    type={'radio'}
                    id={'tracks'}
                    className={'m-3'}
                    label={'Calculated Tracks'}
                    checked={mapSource === 'tracks'}
                    readOnly
                    onClick={() => dispatch(mapActions.setSource('tracks'))}
                ></Form.Check>
            </Form>
        </Form.Group>
    );
}

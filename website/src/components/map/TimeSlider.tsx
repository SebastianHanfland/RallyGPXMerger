import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from '../../store/map.reducer.ts';

export function TimeSlider() {
    const mapTime = useSelector(getCurrenMapTime);
    const dispatch = useDispatch();
    return (
        <Form.Group className={'m-2'}>
            <h5>Time slider</h5>
            <div>{mapTime}</div>
            <Form.Control
                type={'range'}
                min={0}
                max={100000}
                value={mapTime}
                onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
            ></Form.Control>
        </Form.Group>
    );
}

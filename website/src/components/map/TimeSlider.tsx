import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from '../../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../store/types.ts';
import { getCurrentTimeStamp } from './trackSimulationReader.ts';
import { formatDate } from '../../logic/dateUtil.ts';

export function TimeSlider() {
    const mapTime = useSelector(getCurrenMapTime);
    const dateValue = useSelector(getCurrentTimeStamp);
    const dispatch = useDispatch();
    return (
        <Form.Group className={'m-2'}>
            <h5>Time slider</h5>
            <div>{formatDate(dateValue)}</div>
            <Form.Control
                type={'range'}
                min={0}
                max={MAX_SLIDER_TIME}
                value={mapTime}
                onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
            ></Form.Control>
        </Form.Group>
    );
}

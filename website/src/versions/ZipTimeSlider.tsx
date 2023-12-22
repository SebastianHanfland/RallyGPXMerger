import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { mapActions } from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../store/types.ts';
import { formatDate } from '../utils/dateUtil.ts';

export function ZipTimeSlider() {
    const mapTime = 10;
    const dateValue = undefined;
    const dispatch = useDispatch();

    return (
        <Form.Group className={'m-2'}>
            <div>{dateValue ? formatDate(dateValue) : 'No tracks yet calculated'}</div>
            <div className={'d-flex'}>
                <Form.Range
                    min={0}
                    max={MAX_SLIDER_TIME}
                    value={mapTime}
                    onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
                />
            </div>
        </Form.Group>
    );
}

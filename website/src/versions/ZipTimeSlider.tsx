import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from './store/map.reducer.ts';
import { formatDate } from '../utils/dateUtil.ts';
import { getZipCurrentTimeStamp } from '../components/map/hooks/trackSimulationReader.ts';
import { MAX_SLIDER_TIME } from '../common/constants.ts';

export function ZipTimeSlider() {
    const mapTime = useSelector(getCurrenMapTime);
    const dateValue = useSelector(getZipCurrentTimeStamp);
    const dispatch = useDispatch();

    return (
        <Form.Group className={'m-2'}>
            <div>{dateValue ? formatDate(dateValue) : 'Zeit'}</div>
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

import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from './store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../common/constants.ts';
import { getZipCurrentTimeStamp } from './map/dataReading.ts';
import { useIntl } from 'react-intl';

export function ZipTimeSlider() {
    const mapTime = useSelector(getCurrenMapTime);
    const dateValue = useSelector(getZipCurrentTimeStamp);
    const dispatch = useDispatch();
    const intl = useIntl();

    return (
        <Form.Group className={'m-2'}>
            <div>{dateValue ? intl.formatDate(dateValue) : intl.formatMessage({ id: 'msg.time' })}</div>
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

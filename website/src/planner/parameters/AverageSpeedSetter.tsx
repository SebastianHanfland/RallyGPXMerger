import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getAverageSpeedInKmH, settingsActions } from '../store/settings.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';
import { DEFAULT_AVERAGE_SPEED_IN_KM_H } from '../store/constants.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfSpeed(dispatch: AppDispatch, newSpeed: number | undefined) {
    clearTimeout(constructTimeout);
    dispatch(settingsActions.setAverageSpeed(newSpeed));
    constructTimeout = setTimeout(() => {
        dispatch(segmentDataActions.adjustTimesOfAllSegments(newSpeed ?? DEFAULT_AVERAGE_SPEED_IN_KM_H));
    }, 500);
}

const min = 3;
const max = 25;

function AverageSpeedRangeInput() {
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    return (
        <div className={'d-flex'}>
            <span className={'mx-4'}>3&nbsp;km/h</span>
            <Form.Range
                min={min}
                max={max}
                step={0.1}
                value={averageSpeed}
                onChange={(event) => {
                    const newSpeed = Number(event.target.value);
                    debounceSettingOfSpeed(dispatch, newSpeed);
                }}
            />
            <span className={'mx-4'}>20&nbsp;km/h</span>
        </div>
    );
}

export const AverageSpeedNumberInput = () => {
    const intl = useIntl();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const dispatch = useDispatch();
    return (
        <div>
            <Form>
                <Form.Label>
                    <FormattedMessage id={'msg.averageSpeed'} /> in km/h:
                </Form.Label>
                <Form.Control
                    type="number"
                    step={0.1}
                    min={min}
                    max={max}
                    title={intl.formatMessage({ id: 'msg.averageSpeed' })}
                    value={averageSpeed?.toString() ?? ''}
                    onChange={(value) => debounceSettingOfSpeed(dispatch, getCount(value))}
                />
            </Form>
        </div>
    );
};

export function AverageSpeedSetter({ slim }: { slim?: boolean }) {
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    if (slim) {
        return (
            <div>
                <div>
                    <h6>
                        <FormattedMessage id={'msg.averageSpeed.title'} />:
                        <span className={'bg-info p-1'}>{averageSpeed.toFixed(1) + '\xa0km/h'}</span>
                    </h6>
                </div>
                <AverageSpeedRangeInput />
            </div>
        );
    }

    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">
                <FormattedMessage id={'msg.averageSpeed.title'} />
            </h5>
            <AverageSpeedRangeInput />
            <h6 className="form-label m-3">
                <AverageSpeedNumberInput />
            </h6>
        </div>
    );
}

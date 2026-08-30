import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getAverageSpeedInKmH, getForcedAverageSpeed, settingsActions } from '../store/settings.reducer.ts';
import { DEFAULT_AVERAGE_SPEED_IN_KM_H } from '../store/constants.ts';
import {
    formatSegmentSpeedInput,
    parseSegmentSpeedInput,
    ParsedSegmentSpeedInput,
} from '../segments/segmentSpeedUtil.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfSpeed(dispatch: AppDispatch, parsedSpeed: ParsedSegmentSpeedInput) {
    clearTimeout(constructTimeout);
    dispatch(settingsActions.setAverageSpeed({ speed: parsedSpeed.speed, forced: parsedSpeed.forced }));
    constructTimeout = setTimeout(() => {
        dispatch(
            segmentDataActions.adjustTimesOfAllSegments({
                averageSpeed: parsedSpeed.speed ?? DEFAULT_AVERAGE_SPEED_IN_KM_H,
                forcedAverageSpeed: parsedSpeed.forced,
            })
        );
    }, 500);
}

const min = 3;
const max = 25;

function AverageSpeedRangeInput() {
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const forcedAverageSpeed = useSelector(getForcedAverageSpeed);

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
                    debounceSettingOfSpeed(dispatch, { speed: newSpeed, forced: forcedAverageSpeed });
                }}
            />
            <span className={'mx-4'}>20&nbsp;km/h</span>
        </div>
    );
}

export const AverageSpeedNumberInput = () => {
    const intl = useIntl();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const forcedAverageSpeed = useSelector(getForcedAverageSpeed);
    const dispatch = useDispatch();
    const editedByInput = useRef(false);
    const [rawValue, setRawValue] = useState(() => formatSegmentSpeedInput(averageSpeed, forcedAverageSpeed));

    useEffect(() => {
        if (editedByInput.current) {
            editedByInput.current = false;
            return;
        }
        setRawValue(formatSegmentSpeedInput(averageSpeed, forcedAverageSpeed));
    }, [averageSpeed, forcedAverageSpeed]);

    return (
        <div>
            <Form>
                <Form.Label>
                    <FormattedMessage id={'msg.averageSpeed'} /> in km/h:
                </Form.Label>
                <Form.Control
                    type="text"
                    title={intl.formatMessage({ id: 'msg.averageSpeed.hint' })}
                    value={rawValue}
                    onChange={(event) => {
                        const nextValue = event.target.value;
                        editedByInput.current = true;
                        setRawValue(nextValue);
                        if (nextValue.replaceAll('!', '').trim() === '') {
                            debounceSettingOfSpeed(dispatch, { speed: undefined, forced: false });
                            return;
                        }
                        const parsed = parseSegmentSpeedInput(nextValue);
                        if (parsed.speed === undefined) {
                            return;
                        }
                        debounceSettingOfSpeed(dispatch, parsed);
                    }}
                />
            </Form>
        </div>
    );
};

export function AverageSpeedSetter({ slim }: { slim?: boolean }) {
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const forcedAverageSpeed = useSelector(getForcedAverageSpeed);
    const displayedSpeed = `${averageSpeed.toFixed(1)}${forcedAverageSpeed ? '!' : ''}\xa0km/h`;

    if (slim) {
        return (
            <div>
                <div>
                    <h6>
                        <FormattedMessage id={'msg.averageSpeed.title'} />:
                        <span className={'bg-info p-1'}>{displayedSpeed}</span>
                    </h6>
                </div>
                <AverageSpeedRangeInput />
                <AverageSpeedNumberInput />
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

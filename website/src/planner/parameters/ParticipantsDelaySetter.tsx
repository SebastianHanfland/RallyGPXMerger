import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getAverageSpeedInKmH, getParticipantsDelay, settingsActions } from '../store/settings.reducer.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfDelay(dispatch: AppDispatch, value: number) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(settingsActions.setParticipantsDelays(value));
    }, 500);
}

export function ParticipantsDelaySetter({ slim }: { slim?: boolean }) {
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const participantsDelay = useSelector(getParticipantsDelay);

    if (slim) {
        return (
            <div>
                <div>
                    <h6>
                        <FormattedMessage id={'msg.participantsLength.short'} />:
                        <span className={'bg-info p-1'}>
                            {' '}
                            {Math.round((averageSpeed / 3.6) * 100 * participantsDelay) + '\xa0m'}
                        </span>
                    </h6>
                </div>
                <div className={'d-flex'}>
                    <span className={'mx-4'}>
                        <FormattedMessage id={'msg.none'} />
                    </span>
                    <Form.Range
                        min={0}
                        max={1.0}
                        step={0.01}
                        defaultValue={participantsDelay}
                        onChange={(event) => {
                            debounceSettingOfDelay(dispatch, Number(event.target.value));
                        }}
                    />
                    <span className={'mx-4'} style={{ whiteSpace: 'nowrap' }}>
                        <FormattedMessage id={'msg.aLot'} />
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">
                <FormattedMessage id={'msg.participantsDelay.title'} />
            </h5>
            <div className={'d-flex'}>
                <span className={'mx-4'}>
                    <FormattedMessage id={'msg.none'} />
                </span>
                <Form.Range
                    min={0}
                    max={1.0}
                    step={0.01}
                    defaultValue={participantsDelay}
                    onChange={(event) => {
                        debounceSettingOfDelay(dispatch, Number(event.target.value));
                    }}
                />
                <span className={'mx-4'} style={{ whiteSpace: 'nowrap' }}>
                    <FormattedMessage id={'msg.aLot'} />
                </span>
            </div>
            <h6 className="form-label m-3">
                <FormattedMessage id={'msg.participantsDelay'} />
                <span className={'bg-info p-1'}>{participantsDelay.toFixed(2) + '\xa0s'}</span>
            </h6>
            <h6 className="form-label m-3">
                <FormattedMessage id={'msg.participantsLength'} values={{ speed: averageSpeed.toFixed(1) }} />
                <span className={'bg-info p-1'}>
                    {Math.round((averageSpeed / 3.6) * 100 * participantsDelay) + '\xa0m'}
                </span>
            </h6>
        </div>
    );
}

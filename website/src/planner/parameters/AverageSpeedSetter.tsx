import { useDispatch, useSelector } from 'react-redux';
import { getAverageSpeedInKmH, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';

export function AverageSpeedSetter({ slim }: { slim?: boolean }) {
    const dispatch = useDispatch();
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
                <div className={'d-flex'}>
                    <span className={'mx-4'}>3&nbsp;km/h</span>
                    <Form.Range
                        min={3}
                        max={20}
                        step={0.1}
                        value={averageSpeed}
                        onChange={(event) => {
                            dispatch(trackMergeActions.setAverageSpeed(Number(event.target.value)));
                            debounceConstructionOfTracks(dispatch);
                        }}
                    />
                    <span className={'mx-4'}>20&nbsp;km/h</span>
                </div>
            </div>
        );
    }

    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">
                <FormattedMessage id={'msg.averageSpeed.title'} />
            </h5>
            <div className={'d-flex'}>
                <span className={'mx-4'}>3&nbsp;km/h</span>
                <Form.Range
                    min={3}
                    max={20}
                    step={0.1}
                    value={averageSpeed}
                    onChange={(event) => {
                        dispatch(trackMergeActions.setAverageSpeed(Number(event.target.value)));
                        debounceConstructionOfTracks(dispatch);
                    }}
                />
                <span className={'mx-4'}>20&nbsp;km/h</span>
            </div>
            <h6 className="form-label m-3">
                <FormattedMessage id={'msg.averageSpeed'} />
                {': '}
                <span className={'bg-info p-1'}>{averageSpeed.toFixed(1) + '\xa0km/h'}</span>
            </h6>
        </div>
    );
}

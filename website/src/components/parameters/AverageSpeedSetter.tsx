import { useDispatch, useSelector } from 'react-redux';
import { getAverageSpeedInKmH, trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';

export function AverageSpeedSetter() {
    const dispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    return (
        <div>
            <h5 className="form-label m-3">Average speed of the rally</h5>
            <div className={'d-flex'}>
                <span className={'mx-4'}>3&nbsp;km/h</span>
                <Form.Range
                    min={3}
                    max={20}
                    step={0.1}
                    value={averageSpeed}
                    onChange={(event) => dispatch(trackMergeActions.setAverageSpeed(Number(event.target.value)))}
                />
                <span className={'mx-4'}>20&nbsp;km/h</span>
            </div>
            <h6 className="form-label m-3">
                {'Average speed: '}
                <span className={'bg-info p-1'}>{averageSpeed.toFixed(1) + ' km/h'}</span>
            </h6>
        </div>
    );
}

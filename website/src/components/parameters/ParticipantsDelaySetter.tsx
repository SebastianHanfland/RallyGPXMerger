import { useDispatch, useSelector } from 'react-redux';
import { getParticipantsDelay, trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';

export function ParticipantsDelaySetter() {
    const dispatch = useDispatch();
    const participantsDelay = useSelector(getParticipantsDelay);
    return (
        <div>
            <h5 className="form-label m-3">Expansion of participants</h5>
            <div className={'d-flex'}>
                <span className={'mx-4'}>None</span>
                <Form.Range
                    min={0}
                    max={1.0}
                    step={0.01}
                    value={participantsDelay}
                    onChange={(event) => dispatch(trackMergeActions.setParticipantsDelays(Number(event.target.value)))}
                />
                <span className={'mx-4'}>A&nbsp;lot</span>
            </div>
            <h6 className="form-label m-3">
                {'Delay of one participant: '}
                <span className={'bg-info p-1'}>{participantsDelay.toFixed(2) + ' s'}</span>
            </h6>
            <h6 className="form-label m-3">
                {'Length of 100 people (based on 12 km/h): '}
                <span className={'bg-info p-1'}>{Math.round((12 / 3.6) * 100 * participantsDelay) + ' m'}</span>
            </h6>
        </div>
    );
}

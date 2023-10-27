import { useDispatch, useSelector } from 'react-redux';
import { getParticipantsDelay, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';

export function ParticipantsDelaySetter() {
    const dispatch = useDispatch();
    const participantsDelay = useSelector(getParticipantsDelay);
    return (
        <div>
            <label className="form-label m-3">Delay of one participant</label>
            <div>{participantsDelay + ' s'}</div>
            <label className="form-label m-3">Length of 100 people (based on 12 km/h)</label>
            <div>{Math.round((12 / 3.6) * 100 * participantsDelay) + ' m'}</div>
            <Form.Control
                type={'range'}
                min={0}
                max={1.0}
                step={0.01}
                value={participantsDelay}
                onChange={(event) => dispatch(trackMergeActions.setParticipantsDelays(Number(event.target.value)))}
            />
        </div>
    );
}

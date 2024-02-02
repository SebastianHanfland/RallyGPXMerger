import { useDispatch, useSelector } from 'react-redux';
import { getPlanningLabel, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';

export function PlanningLabel() {
    const dispatch = useDispatch();
    const planningLabel = useSelector(getPlanningLabel);
    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">Label of current planning:</h5>
            <p>This can be a version string that appears in the file names and the documents</p>
            <Form.Control
                type="text"
                placeholder="Label for planning"
                value={planningLabel}
                onChange={(value) => dispatch(trackMergeActions.setPlanningLabel(value.target.value))}
            />
        </div>
    );
}

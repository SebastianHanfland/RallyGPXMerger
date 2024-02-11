import { useDispatch, useSelector } from 'react-redux';
import { getPlanningLabel, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

export function PlanningLabel() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const planningLabel = useSelector(getPlanningLabel);
    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">
                <FormattedMessage id={'msg.label.title'} />
            </h5>
            <p>
                <FormattedMessage id={'msg.label.hint'} />
            </p>
            <Form.Control
                type="text"
                placeholder={intl.formatMessage({ id: 'msg.label.title' })}
                value={planningLabel}
                onChange={(value) => dispatch(trackMergeActions.setPlanningLabel(value.target.value))}
            />
        </div>
    );
}

import { useDispatch, useSelector } from 'react-redux';
import { getPlanningLabel, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';

export function PlanningLabel() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const planningLabel = useSelector(getPlanningLabel);
    return (
        <div className={'d-inline-block m-3'}>
            <p>
                <FormattedMessage id={'msg.label.hint'} />
            </p>
            <Form.Control
                type="text"
                placeholder={intl.formatMessage({ id: 'msg.label.title' })}
                as="textarea"
                rows={5}
                value={planningLabel}
                onChange={(value) => {
                    dispatch(trackMergeActions.setPlanningLabel(value.target.value));
                }}
            />
        </div>
    );
}

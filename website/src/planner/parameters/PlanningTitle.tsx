import { useDispatch, useSelector } from 'react-redux';
import { getPlanningTitle, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

export function PlanningTitle() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const planningTitle = useSelector(getPlanningTitle);
    return (
        <div className={'d-inline-block m-3'}>
            <p>
                <FormattedMessage id={'msg.titleOfPlanning.hint'} />
            </p>
            <Form.Control
                type="text"
                placeholder={intl.formatMessage({ id: 'msg.titleOfPlanning' })}
                value={planningTitle ?? ''}
                onChange={(value) => dispatch(trackMergeActions.setPlanningTitle(value.target.value))}
            />
        </div>
    );
}

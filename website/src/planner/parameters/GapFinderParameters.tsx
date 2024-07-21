import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { getGapToleranceInKm, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';

export const GapFinderParameters = () => {
    const intl = useIntl();
    const gapToleranceInKm = useSelector(getGapToleranceInKm);
    const dispatch = useDispatch();
    return (
        <div>
            {' '}
            <Form>
                <Form.Label>
                    <FormattedMessage id={'msg.gapTolerance.hint'} />
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.customSpeed.placeholder' })}
                    title={intl.formatMessage({ id: 'msg.customSpeed.placeholder' })}
                    value={gapToleranceInKm?.toString() ?? ''}
                    onChange={(value) => dispatch(trackMergeActions.setGapToleranceInKm(getCount(value)))}
                />
            </Form>
        </div>
    );
};

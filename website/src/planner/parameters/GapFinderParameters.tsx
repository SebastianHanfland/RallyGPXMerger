import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getGapToleranceInKm, settingsActions } from '../store/settings.reducer.ts';

export const GapFinderParameters = () => {
    const intl = useIntl();
    const gapToleranceInKm = useSelector(getGapToleranceInKm);
    const dispatch = useDispatch();
    const gapToleranceInMeters = gapToleranceInKm === undefined ? undefined : gapToleranceInKm * 1000;
    return (
        <div>
            <Form>
                <Form.Label>
                    <FormattedMessage id={'msg.gapTolerance.hint'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    title={intl.formatMessage({ id: 'msg.gapTolerance.hint' })}
                    value={gapToleranceInMeters?.toString() ?? ''}
                    onChange={(value) => {
                        const gapTolerance = getCount(value);
                        dispatch(
                            settingsActions.setGapToleranceInKm(
                                gapTolerance === undefined ? undefined : gapTolerance / 1000
                            )
                        );
                    }}
                />
            </Form>
        </div>
    );
};

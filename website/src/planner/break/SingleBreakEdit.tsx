import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { BreakPosition } from '../logic/resolving/selectors/getBreakPositions.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { getCount } from '../../utils/inputUtil.ts';
import { successNotification } from '../store/toast.reducer.ts';

interface Props {
    breakInfo: BreakPosition;
}

export const SingleBreakEdit = ({ breakInfo }: Props) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [minutes, setMinutes] = useState(breakInfo.minutes);
    const message = intl.formatMessage({ id: 'msg.breakAdjusted' });
    const changeMinutes = () => {
        dispatch(
            trackMergeActions.setMinutesForBreak({ minutes, breakId: breakInfo.breakId, trackId: breakInfo.trackId })
        );
        successNotification(dispatch, message, message);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }} className={'mx-2'}>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.minutes'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    style={{ width: '100px' }}
                    title={intl.formatMessage({ id: 'msg.minutes.details' })}
                    value={minutes ?? 0}
                    onChange={(value) => setMinutes(getCount(value) ?? 0)}
                />
            </Form.Group>
            <div className={'mx-1'}>
                <Button variant="primary" onClick={changeMinutes}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </div>
        </div>
    );
};

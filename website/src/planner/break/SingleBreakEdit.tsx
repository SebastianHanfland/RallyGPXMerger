import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getColor } from '../../utils/colorUtil.ts';
import { BreakPosition } from '../logic/resolving/selectors/getBreakPositions.ts';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { getCount } from '../../utils/inputUtil.ts';

interface Props {
    breakInfo: BreakPosition;
}

export const SingleBreakEdit = ({ breakInfo }: Props) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [minutes, setMinutes] = useState(breakInfo.minutes);
    const changeMinutes = () => {
        dispatch(
            trackMergeActions.setMinutesForBreak({ minutes, breakId: breakInfo.breakId, trackId: breakInfo.trackId })
        );
    };

    return (
        <div>
            <Form.Group>
                <Form.Label>
                    <FormattedMessage id={'msg.minutes'} />
                </Form.Label>
                <Form.Control
                    type="number"
                    step={1}
                    title={intl.formatMessage({ id: 'msg.minutes.details' })}
                    value={minutes ?? 0}
                    onChange={(value) => setMinutes(getCount(value) ?? 0)}
                />
            </Form.Group>
            <Button variant="primary" onClick={changeMinutes}>
                <FormattedMessage id={'msg.save'} />
            </Button>
        </div>
    );
};

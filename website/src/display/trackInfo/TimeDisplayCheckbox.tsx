import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { displayMapActions, getShowTimes } from '../store/displayMapReducer.ts';
import { DisplayDispatch } from '../store/store.ts';
import { Form } from 'react-bootstrap';

export function TimeDisplayCheckbox() {
    const dispatch: DisplayDispatch = useDispatch();
    const showTimes = useSelector(getShowTimes);

    return (
        <div>
            <Form.Check
                type={'checkbox'}
                className={'m-3'}
                label={<FormattedMessage id={'msg.times'} />}
                checked={showTimes}
                readOnly
                onClick={() => dispatch(displayMapActions.setShowTimes(!showTimes))}
            ></Form.Check>
        </div>
    );
}

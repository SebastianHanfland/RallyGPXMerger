import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { displayMapActions, getShowTimes } from '../store/displayMapReducer.ts';
import { DisplayDispatch } from '../store/store.ts';
import { Form } from 'react-bootstrap';
import { getDisplayEntryPoints } from '../store/displayTracksReducer.ts';

export function TimeDisplayCheckbox() {
    const dispatch: DisplayDispatch = useDispatch();
    const showTimes = useSelector(getShowTimes);
    const entryPointPositions = useSelector(getDisplayEntryPoints);

    if (entryPointPositions.length === 0) {
        return null;
    }

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

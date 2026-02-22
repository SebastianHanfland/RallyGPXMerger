import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { geoCodingActions, getOnlyShowUnknown } from '../store/geoCoding.reducer.ts';

export const OnlyShowUnknownCheckBox = () => {
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);
    const dispatch = useDispatch();

    return (
        <Form.Check
            type={'checkbox'}
            id={'onlyUnknown'}
            className={'m-3'}
            label={<FormattedMessage id={'msg.onlyUnknown'} />}
            checked={onlyShowUnknown}
            readOnly={true}
            onClick={() => dispatch(geoCodingActions.toggleOnlyShowUnknown())}
        ></Form.Check>
    );
};

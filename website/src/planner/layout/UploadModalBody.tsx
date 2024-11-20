import { useDispatch, useSelector } from 'react-redux';
import { backendActions, getPlanningPassword } from '../store/backend.reducer.ts';
import { useIntl } from 'react-intl';
import { Form } from 'react-bootstrap';

export const UploadModalBody = ({ text }: { text: string }) => {
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch = useDispatch();
    const intl = useIntl();
    return (
        <div>
            <div>{text}</div>
            <div>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.password' })}
                    value={planningPassword ?? ''}
                    onChange={(value) => dispatch(backendActions.setPlanningPassword(value.target.value))}
                />
            </div>
        </div>
    );
};

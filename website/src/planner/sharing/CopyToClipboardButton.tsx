import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { successNotification } from '../store/toast.reducer.ts';
import { useIntl } from 'react-intl';

interface Props {
    text: string;
}

export const CopyToClipboardButton = ({ text }: Props) => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const onClick = () => {
        navigator.clipboard.writeText(text);
        successNotification(
            dispatch,
            intl.formatMessage({ id: 'msg.copied.title' }),
            intl.formatMessage({ id: 'msg.copied.message' })
        );
    };
    return (
        <Button
            className={'flex-shrink-0 text-nowrap'}
            onClick={onClick}
            title={intl.formatMessage({ id: 'msg.copy.hint' })}
        >
            {intl.formatMessage({ id: 'msg.copy' })}
        </Button>
    );
};

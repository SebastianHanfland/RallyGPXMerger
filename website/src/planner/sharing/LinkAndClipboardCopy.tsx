import { FormattedMessage } from 'react-intl';
import { CopyToClipboardButton } from './CopyToClipboardButton.tsx';

const entryStyle = { display: 'flex', justifyContent: 'space-between', margin: '10px' };

interface Props {
    messageId: string;
    link: string;
}

export const LinkAndClipboardCopy = ({ link, messageId }: Props) => {
    return (
        <div style={entryStyle}>
            <span>
                <FormattedMessage id={messageId} />: <b>{link}</b>
            </span>
            <CopyToClipboardButton text={link} />
        </div>
    );
};

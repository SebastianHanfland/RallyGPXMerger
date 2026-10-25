import { FormattedMessage, useIntl } from 'react-intl';
import { CopyToClipboardButton } from './CopyToClipboardButton.tsx';
import { Button } from 'react-bootstrap';
import openInNew from '../../assets/open-in-new.svg';

const entryStyle = { display: 'flex', justifyContent: 'space-between', margin: '10px' };

interface Props {
    messageId: string;
    link: string;
    openLink?: boolean;
}

export const LinkAndClipboardCopy = ({ link, messageId, openLink = true }: Props) => {
    const intl = useIntl();

    return (
        <div style={entryStyle}>
            <span>
                <FormattedMessage id={messageId} />: <b>{link}</b>
            </span>
            <div>
                <CopyToClipboardButton text={link} />
                {openLink && (
                    <Button
                        href={link}
                        target={'_blank'}
                        rel={'noreferrer'}
                        title={intl.formatMessage({ id: 'msg.open.hint' })}
                    >
                        <img src={openInNew} alt={''} className={'me-1'} />
                        <FormattedMessage id={'msg.open'} />
                    </Button>
                )}
            </div>
        </div>
    );
};

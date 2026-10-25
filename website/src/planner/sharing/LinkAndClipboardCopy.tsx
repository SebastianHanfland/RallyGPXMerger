import { FormattedMessage, useIntl } from 'react-intl';
import type { CSSProperties } from 'react';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { Button } from 'react-bootstrap';
import openInNew from '../../assets/open-in-new.svg';

const entryStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    margin: '10px',
};
const textStyle: CSSProperties = { minWidth: 0, flex: '1 1 auto', overflowWrap: 'anywhere' };
const actionStyle: CSSProperties = { display: 'flex', flexShrink: 0, gap: '4px' };

interface Props {
    messageId: string;
    link: string;
    openLink?: boolean;
}

export const LinkAndClipboardCopy = ({ link, messageId, openLink = true }: Props) => {
    const intl = useIntl();

    return (
        <div style={entryStyle}>
            <span style={textStyle}>
                <FormattedMessage id={messageId} />: <b>{link}</b>
            </span>
            <div style={actionStyle}>
                {openLink && (
                    <Button
                        className={'flex-shrink-0 text-nowrap'}
                        variant={'secondary'}
                        href={link}
                        target={'_blank'}
                        rel={'noreferrer'}
                        title={intl.formatMessage({ id: 'msg.open.hint' })}
                    >
                        <img src={openInNew} alt={''} className={'me-1'} />
                        <FormattedMessage id={'msg.open'} />
                    </Button>
                )}
                <CopyToClipboardButton text={link} />
            </div>
        </div>
    );
};

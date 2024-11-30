import { FormattedMessage } from 'react-intl';

export function BlockTextDescription({ messageId }: { messageId: string }) {
    return (
        <div style={{ textAlign: 'left' }} className={'m-2'}>
            <FormattedMessage id={messageId} />
        </div>
    );
}

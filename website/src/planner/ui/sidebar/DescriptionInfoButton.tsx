import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ConfirmationModal } from '../../../common/ConfirmationModal.tsx';
import { InfoIcon } from '../../../utils/icons/InfoIcon.tsx';

interface Props {
    titleMessageId: string;
    descriptionMessageId: string;
}

export const DescriptionInfoButton = ({ titleMessageId, descriptionMessageId }: Props) => {
    const [open, setOpen] = useState(false);
    const intl = useIntl();
    const title = intl.formatMessage({ id: titleMessageId });

    return (
        <>
            <Button
                className={'mx-1 rounded-2'}
                variant={'info'}
                onClick={() => setOpen(true)}
                title={title}
                aria-label={title}
            >
                <InfoIcon />
            </Button>
            {open && (
                <ConfirmationModal
                    closeModal={() => setOpen(false)}
                    title={title}
                    body={<FormattedMessage id={descriptionMessageId} />}
                />
            )}
        </>
    );
};

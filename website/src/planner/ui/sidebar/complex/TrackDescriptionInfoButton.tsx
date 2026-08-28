import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ConfirmationModal } from '../../../../common/ConfirmationModal.tsx';
import { InfoIcon } from '../../../../utils/icons/InfoIcon.tsx';

export const TrackDescriptionInfoButton = () => {
    const [open, setOpen] = useState(false);
    const intl = useIntl();
    const title = intl.formatMessage({ id: 'msg.tracks.title' });

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
                    body={<FormattedMessage id={'msg.description.tracks'} />}
                />
            )}
        </>
    );
};

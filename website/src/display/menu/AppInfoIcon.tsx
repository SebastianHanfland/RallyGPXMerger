import { InfoIcon } from '../../utils/icons/InfoIcon.tsx';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export const AppInfoIcon = () => {
    const [open, setOpen] = useState(false);
    const intl = useIntl();
    return (
        <span>
            <span
                style={{ cursor: 'pointer', margin: '5px' }}
                title={intl.formatMessage({ id: 'msg.criticalMaps.title' })}
                onClick={() => setOpen(true)}
            >
                <InfoIcon />
            </span>
            {open && (
                <ConfirmationModal
                    closeModal={() => setOpen(false)}
                    title={intl.formatMessage({ id: 'msg.criticalMaps.title' })}
                    body={
                        <div>
                            <FormattedMessage id={'msg.criticalMaps.body'} />
                            <div>
                                <a
                                    href={'https://www.criticalmaps.net'}
                                    target={'_blank'}
                                    referrerPolicy={'no-referrer'}
                                >
                                    https://www.criticalmaps.net
                                </a>
                            </div>
                        </div>
                    }
                />
            )}
        </span>
    );
};

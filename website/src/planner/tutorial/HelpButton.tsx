import { useState } from 'react';
import { TutorialModal } from './TutorialModal.tsx';
import { Button } from 'react-bootstrap';
import info from '../../assets/info.svg';
import { FormattedMessage, useIntl } from 'react-intl';

export const HelpButton = () => {
    const intl = useIntl();
    const [showHelp, setShowHelp] = useState(false);
    return (
        <>
            <Button
                variant={'info'}
                onClick={() => setShowHelp(true)}
                title={intl.formatMessage({ id: 'msg.help.hint' })}
            >
                <img src={info} className={'m-1'} alt="help" />
                <span className={'d-none d-lg-block'}>
                    <FormattedMessage id={'msg.help'} />
                </span>
            </Button>
            {showHelp && <TutorialModal closeModal={() => setShowHelp(false)} />}
        </>
    );
};

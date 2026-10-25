import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { SimpleSettingsModal } from './SimpleSettingsModal';

export function SimpleSettingsButton() {
    const [displayModal, setDisplayModal] = useState(false);

    return (
        <>
            <Button size={'sm'} onClick={() => setDisplayModal(true)}>
                <FormattedMessage id={'msg.settings'} />
            </Button>
            {displayModal && <SimpleSettingsModal onHide={() => setDisplayModal(false)} />}
        </>
    );
}

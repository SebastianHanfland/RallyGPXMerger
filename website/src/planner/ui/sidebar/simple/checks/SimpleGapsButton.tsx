import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../../utils/icons/CheckIcon';
import { WarningIcon } from '../../../../../utils/icons/WarningIcon';
import { SimpleGapsModal } from './SimpleGapsModal';

interface Props {
    warning: boolean;
}

export function SimpleGapsButton({ warning }: Props) {
    const [displayModal, setDisplayModal] = useState(false);

    return (
        <>
            <Button size={'sm'} onClick={() => setDisplayModal(true)}>
                <span aria-hidden="true">{warning ? <WarningIcon /> : <CheckIcon />}</span>
                <FormattedMessage id={'msg.gaps'} />
            </Button>
            {displayModal && <SimpleGapsModal onHide={() => setDisplayModal(false)} />}
        </>
    );
}

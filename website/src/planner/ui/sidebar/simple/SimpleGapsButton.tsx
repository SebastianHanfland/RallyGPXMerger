import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { SimpleGapsModal } from './SimpleGapsModal.tsx';

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

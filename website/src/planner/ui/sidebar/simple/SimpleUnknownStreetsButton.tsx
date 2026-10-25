import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon';
import { WarningIcon } from '../../../../utils/icons/WarningIcon';
import type { TrackStreetInfo } from '../../../logic/resolving/types';
import { StreetInfoModal } from '../../elements/StreetInfoModal';

interface Props {
    warning: boolean;
    matchedTrackInfo: TrackStreetInfo | undefined;
}

export function SimpleUnknownStreetsButton({ warning, matchedTrackInfo }: Props) {
    const [displayModal, setDisplayModal] = useState(false);

    return (
        <>
            <Button size={'sm'} onClick={() => setDisplayModal(true)} disabled={!matchedTrackInfo}>
                <span aria-hidden="true">{warning ? <WarningIcon /> : <CheckIcon />}</span>
                <FormattedMessage id={'msg.unknownStreets'} />
            </Button>
            {displayModal && matchedTrackInfo && (
                <StreetInfoModal selectedTrack={matchedTrackInfo} onHide={() => setDisplayModal(false)} />
            )}
        </>
    );
}

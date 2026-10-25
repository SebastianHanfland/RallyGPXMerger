import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import type { OverviewAccordionStatuses } from '../complex/overviewStatus.ts';
import { SimplePointsModal } from './SimplePointsModal.tsx';

interface Props {
    points: OverviewAccordionStatuses['points'];
}

export function SimplePointsButton({ points }: Props) {
    const [displayModal, setDisplayModal] = useState(false);
    const intl = useIntl();
    const pointsLabel = intl.formatMessage({ id: 'msg.points' });
    const pointsOnPublicMapLabel = intl.formatMessage({ id: 'msg.pointsOnPublicMap' });

    return (
        <>
            <Button size={'sm'} onClick={() => setDisplayModal(true)}>
                <span aria-hidden="true">{points.warning ? <WarningIcon /> : <CheckIcon />}</span>
                {points.warning ? (
                    <>
                        {points.todoCount} <FormattedMessage id={'msg.openTodos'} />
                        {` (${points.impedimentCount} ${intl.formatMessage({ id: 'msg.impediments' })})`}
                    </>
                ) : (
                    <FormattedMessage id={'msg.noOpenPoints'} />
                )}
                {` (${points.pointCount} ${pointsLabel})`}
                {` (${points.publicPointCount} ${pointsOnPublicMapLabel})`}
            </Button>
            {displayModal && <SimplePointsModal onHide={() => setDisplayModal(false)} />}
        </>
    );
}

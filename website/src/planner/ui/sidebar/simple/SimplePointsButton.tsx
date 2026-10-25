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
    const pointsStatusLabel = points.warning
        ? `${points.todoCount} ${intl.formatMessage({ id: 'msg.openTodos' })} (${points.impedimentCount} ${intl.formatMessage({ id: 'msg.impediments' })})`
        : intl.formatMessage({ id: 'msg.noOpenPoints' });
    const tooltip = `${pointsStatusLabel} (${points.pointCount} ${pointsLabel}) (${points.publicPointCount} ${pointsOnPublicMapLabel})`;

    return (
        <>
            <Button size={'sm'} title={tooltip} onClick={() => setDisplayModal(true)}>
                <span aria-hidden="true">{points.warning ? <WarningIcon /> : <CheckIcon />}</span>
                <FormattedMessage id={'msg.points'} />
            </Button>
            {displayModal && <SimplePointsModal onHide={() => setDisplayModal(false)} />}
        </>
    );
}

import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { getSelectedSidebarSection } from '../../../store/layout.reducer.ts';
import { SidebarNavItem } from '../SidebarNavItem.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { TracksGapWarning } from '../../../tracks/TracksGapWarning.tsx';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { getWarningAccordionDefinitions, useOverviewAccordionStatuses } from './overviewStatus.ts';

export const PlannerSidebarNavigation = () => {
    const intl = useIntl();
    const selectedSection = useSelector(getSelectedSidebarSection);
    const segmentsCount = useSelector(getParsedGpxSegments).length;
    const tracksCount = useSelector(getTrackCompositions).length;
    const overviewStatuses = useOverviewAccordionStatuses();
    const warningDefinitions = getWarningAccordionDefinitions(overviewStatuses);
    const overviewWarningTitle = warningDefinitions.length
        ? [
              intl.formatMessage({ id: 'msg.overviewWarnings' }),
              ...warningDefinitions.map(({ messageId }) => intl.formatMessage({ id: messageId })),
          ].join('\n')
        : undefined;

    return (
        <div style={{ height: '40px', zIndex: 1000000, backgroundColor: 'white', display: 'flex' }}>
            <Nav
                fill
                variant="tabs"
                activeKey={selectedSection}
                className={'shadow'}
                style={{ position: 'fixed', zIndex: 1000000, width: '50%' }}
            >
                <SidebarNavItem section={'segments'} count={segmentsCount} tabIndex={0}>
                    <FormattedMessage id={'msg.segments'} />({segmentsCount})
                </SidebarNavItem>
                <SidebarNavItem section={'tracks'} count={tracksCount} tabIndex={1}>
                    <TracksGapWarning />
                    <FormattedMessage id={'msg.tracks'} />({tracksCount})
                </SidebarNavItem>
                <SidebarNavItem section={'overview'} tabIndex={2} title={overviewWarningTitle}>
                    <span aria-hidden="true">{warningDefinitions.length ? <WarningIcon /> : <CheckIcon />}</span>
                    <FormattedMessage id={'msg.overview'} />
                </SidebarNavItem>
                <SidebarNavItem section={'settings'} tabIndex={3}>
                    <FormattedMessage id={'msg.settings'} />
                </SidebarNavItem>
            </Nav>
        </div>
    );
};

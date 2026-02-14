import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { FormattedMessage } from 'react-intl';
import { getHasChangesSinceLastUpload } from '../store/backend.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';

export const PlannerSidebarNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    const segmentsCount = useSelector(getParsedGpxSegments).length;
    const tracksCount = useSelector(getTrackCompositions).length;
    const hasChangesSinceLastUpload = useSelector(getHasChangesSinceLastUpload);

    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'segments'} count={segmentsCount} tabIndex={0}>
                <FormattedMessage id={'msg.segments'} />({segmentsCount})
            </SidebarNavItem>
            <SidebarNavItem section={'tracks'} count={tracksCount} tabIndex={1}>
                <FormattedMessage id={'msg.tracks'} />({tracksCount})
            </SidebarNavItem>
            <SidebarNavItem section={'settings'} tabIndex={2}>
                <FormattedMessage id={'msg.settings'} />
            </SidebarNavItem>
            <SidebarNavItem section={'documents'} tabIndex={3}>
                {hasChangesSinceLastUpload && <Warning size={10} />}
                <FormattedMessage id={'msg.documents'} />
            </SidebarNavItem>
        </Nav>
    );
};

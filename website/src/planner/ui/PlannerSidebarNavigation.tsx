import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { FormattedMessage } from 'react-intl';
import { getHasChangesSinceLastUpload } from '../store/backend.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

export const PlannerSidebarNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    const segmentsCount = useSelector(getGpxSegments).length;
    const tracksCount = useSelector(getTrackCompositions).length;
    const hasChangesSinceLastUpload = useSelector(getHasChangesSinceLastUpload);

    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'segments'} count={segmentsCount}>
                <FormattedMessage id={'msg.segments'} />({segmentsCount})
            </SidebarNavItem>
            <SidebarNavItem section={'tracks'} count={tracksCount}>
                <FormattedMessage id={'msg.tracks'} />({tracksCount})
            </SidebarNavItem>
            <SidebarNavItem section={'settings'}>
                <FormattedMessage id={'msg.settings'} />
            </SidebarNavItem>
            <SidebarNavItem section={'documents'}>
                {hasChangesSinceLastUpload && <Warning />}
                <FormattedMessage id={'msg.documents'} />
            </SidebarNavItem>
        </Nav>
    );
};

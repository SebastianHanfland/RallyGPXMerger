import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';

export const PlannerSidebarNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    const segmentsCount = useSelector(getGpxSegments).length;
    const trackssCount = useSelector(getTrackCompositions).length;

    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'segments'} count={segmentsCount} />
            <SidebarNavItem section={'tracks'} count={trackssCount} />
            <SidebarNavItem section={'settings'} />
            <SidebarNavItem section={'documents'} />
        </Nav>
    );
};

import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';

export const PlannerSidebarSimpleNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    const segmentsCount = useSelector(getGpxSegments).length;
    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'segments'} count={segmentsCount} />
            <SidebarNavItem section={'settings'} />
            <SidebarNavItem section={'documents'} />
        </Nav>
    );
};

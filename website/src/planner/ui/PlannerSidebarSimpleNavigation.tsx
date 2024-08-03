import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';

export const PlannerSidebarSimpleNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'simpleTrack'} />
            <SidebarNavItem section={'settings'} />
        </Nav>
    );
};

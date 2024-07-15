import { Nav } from 'react-bootstrap';
import { SidebarSections } from './PlannerSidebar.tsx';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedSidebarSection, layoutActions } from '../store/layout.reducer.ts';

interface ItemProps {
    section: SidebarSections;
}

function NavItem({ section }: ItemProps) {
    const dispatch = useDispatch();
    const setSelectedSection = (section: SidebarSections) => dispatch(layoutActions.setSelectedSidebarSection(section));
    return (
        <Nav.Item onClick={() => setSelectedSection(section)}>
            <Nav.Link eventKey={section}>
                <FormattedMessage id={`msg.${section}`} />
            </Nav.Link>
        </Nav.Item>
    );
}

export const PlannerSidebarSimpleNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <NavItem section={'segments'} />
            <NavItem section={'settings'} />
            <NavItem section={'documents'} />
        </Nav>
    );
};

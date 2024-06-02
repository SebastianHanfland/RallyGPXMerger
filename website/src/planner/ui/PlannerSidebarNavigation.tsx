import { Nav } from 'react-bootstrap';
import { SidebarSections } from './PlannerSidebar.tsx';
import { FormattedMessage } from 'react-intl';

interface Props {
    setSelectedSection: (section: SidebarSections) => void;
}

interface ItemProps {
    section: SidebarSections;
    setSelectedSection: (section: SidebarSections) => void;
}

function NavItem({ section, setSelectedSection }: ItemProps) {
    return (
        <Nav.Item onClick={() => setSelectedSection(section)}>
            <Nav.Link eventKey={section}>
                <FormattedMessage id={`msg.${section}`} />
            </Nav.Link>
        </Nav.Item>
    );
}

export const PlannerSidebarNavigation = ({ setSelectedSection }: Props) => {
    return (
        <Nav fill variant="tabs">
            <NavItem section={'segments'} setSelectedSection={setSelectedSection} />
            <NavItem section={'tracks'} setSelectedSection={setSelectedSection} />
            <NavItem section={'settings'} setSelectedSection={setSelectedSection} />
            <NavItem section={'documents'} setSelectedSection={setSelectedSection} />
        </Nav>
    );
};

import { Nav } from 'react-bootstrap';
import { SidebarSections } from './PlannerSidebar.tsx';

interface Props {
    setSelectedSection: (section: SidebarSections) => void;
}

export const PlannerSidebarNavigation = ({ setSelectedSection }: Props) => {
    return (
        <Nav fill variant="tabs">
            <Nav.Item onClick={() => setSelectedSection('gpx')}>
                <Nav.Link eventKey={'gpx'}>Gpx</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => setSelectedSection('tracks')}>
                <Nav.Link eventKey={'tracks'}>Tracks</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => setSelectedSection('documents')}>
                <Nav.Link eventKey={'documents'}>Documents</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

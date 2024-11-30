import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { Nav } from 'react-bootstrap';
import { SidebarSections } from '../store/types.ts';
import { ReactNode } from 'react';

interface Props {
    section: SidebarSections;
    count?: number;
    tabIndex: number;
    children: ReactNode;
}

export function SidebarNavItem({ section, children, tabIndex }: Props) {
    const dispatch = useDispatch();
    const setSelectedSection = (section: SidebarSections) => dispatch(layoutActions.setSelectedSidebarSection(section));

    return (
        <Nav.Item onClick={() => setSelectedSection(section)} tabIndex={tabIndex}>
            <Nav.Link eventKey={section}>{children}</Nav.Link>
        </Nav.Item>
    );
}

import { useDispatch } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer.ts';
import { Nav } from 'react-bootstrap';
import { SidebarSections } from '../../store/types.ts';
import { ReactNode } from 'react';

interface Props {
    section: SidebarSections;
    count?: number;
    tabIndex: number;
    title?: string;
    children: ReactNode;
}

export function SidebarNavItem({ section, children, tabIndex, title }: Props) {
    const dispatch = useDispatch();
    const setSelectedSection = (section: SidebarSections) => dispatch(layoutActions.setSelectedSidebarSection(section));

    return (
        <Nav.Item onClick={() => setSelectedSection(section)} tabIndex={tabIndex} style={{ backgroundColor: 'white' }}>
            <Nav.Link eventKey={section} title={title}>
                {children}
            </Nav.Link>
        </Nav.Item>
    );
}

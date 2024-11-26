import { useDispatch, useSelector } from 'react-redux';
import { getHasSingleTrack, layoutActions } from '../store/layout.reducer.ts';
import { Nav } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { SidebarSections } from '../store/types.ts';

interface Props {
    section: SidebarSections;
    count?: number;
}

export function SidebarNavItem({ section, count }: Props) {
    const dispatch = useDispatch();
    const isSimplePlanning = useSelector(getHasSingleTrack);
    const setSelectedSection = (section: SidebarSections) => dispatch(layoutActions.setSelectedSidebarSection(section));
    return (
        <Nav.Item onClick={() => setSelectedSection(section)}>
            <Nav.Link eventKey={section}>
                <FormattedMessage id={`msg.${section}`} />
                {section === 'settings' && isSimplePlanning && (
                    <span>
                        {'/'}
                        <FormattedMessage id={'msg.documents'} />
                    </span>
                )}
                {count ? ` (${count})` : null}
            </Nav.Link>
        </Nav.Item>
    );
}

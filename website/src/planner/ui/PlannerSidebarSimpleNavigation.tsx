import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';
import { FormattedMessage } from 'react-intl';
import { getHasChangesSinceLastUpload } from '../store/backend.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

export const PlannerSidebarSimpleNavigation = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    const hasChangesSinceLastUpload = useSelector(getHasChangesSinceLastUpload);

    return (
        <Nav fill variant="tabs" activeKey={selectedSection}>
            <SidebarNavItem section={'simpleTrack'}>
                <FormattedMessage id={'msg.simpleTrack'} />
            </SidebarNavItem>
            <SidebarNavItem section={'settings'}>
                {hasChangesSinceLastUpload && <Warning />}
                <FormattedMessage id={'msg.settings'} />
            </SidebarNavItem>
        </Nav>
    );
};

import { FileUploadSection } from '../../../segments/FileUploadSection';
import { PlannerSidebarTracks } from './PlannerSidebarTracks';
import { PlannerSidebarSettings } from './PlannerSidebarSettings';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../../../store/layout.reducer';
import { PlannerSidebarOverview } from './PlannerSidebarOverview';

export const PlannerSidebarContent = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    switch (selectedSection) {
        case 'segments':
            return <FileUploadSection />;
        case 'tracks':
            return <PlannerSidebarTracks />;
        case 'settings':
            return <PlannerSidebarSettings />;
        case 'overview':
        default:
            return <PlannerSidebarOverview />;
    }
};

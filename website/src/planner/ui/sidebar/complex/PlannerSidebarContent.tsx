import { FileUploadSection } from '../../../segments/FileUploadSection.tsx';
import { PlannerSidebarTracks } from '../PlannerSidebarTracks.tsx';
import { PlannerSidebarDocuments } from './PlannerSidebarDocuments.tsx';
import { PlannerSidebarSettings } from '../PlannerSidebarSettings.tsx';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../../../store/layout.reducer.ts';

export const PlannerSidebarContent = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    switch (selectedSection) {
        case 'segments':
            return <FileUploadSection />;
        case 'tracks':
            return <PlannerSidebarTracks />;
        case 'documents':
            return <PlannerSidebarDocuments />;
        case 'settings':
            return <PlannerSidebarSettings />;
    }
};

import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarTracks } from './PlannerSidebarTracks.tsx';
import { PlannerSidebarDocuments } from './PlannerSidebarDocuments.tsx';
import { PlannerSidebarSettings } from './PlannerSidebarSettings.tsx';

export const PlannerSidebarContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
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

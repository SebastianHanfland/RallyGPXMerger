import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarTracks } from './PlannerSidebarTracks.tsx';
import { PlannerSidebarDocuments } from './PlannerSidebarDocuments.tsx';

export const PlannerSidebarContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'gpx':
            return <FileUploadSection />;
        case 'tracks':
            return <PlannerSidebarTracks />;
        case 'documents':
            return <PlannerSidebarDocuments />;
    }
};

import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarTracks } from './PlannerSidebarTracks.tsx';

export const PlannerSidebarContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'gpx':
            return <FileUploadSection />;
        case 'tracks':
            return <PlannerSidebarTracks />;
        case 'documents':
            return null;
    }
};

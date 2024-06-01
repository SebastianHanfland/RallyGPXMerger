import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';

export const PlannerSidebarContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'gpx':
            return <FileUploadSection />;
        case 'tracks':
            return <PlannerSidebarTrackDetails />;
        case 'documents':
            return null;
    }
};

import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { TrackCompositionSection } from '../tracks/TrackCompositionSection.tsx';

export const PlannerSidebarContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'gpx':
            return <FileUploadSection />;
        case 'tracks':
            return <TrackCompositionSection />;
        case 'documents':
            return null;
    }
};

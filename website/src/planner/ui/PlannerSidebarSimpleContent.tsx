import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarDocuments } from './PlannerSidebarDocuments.tsx';
import { PlannerSidebarSettings } from './PlannerSidebarSettings.tsx';

export const PlannerSidebarSimpleContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'segments':
            return <FileUploadSection />;
        case 'documents':
            return <PlannerSidebarDocuments />;
        case 'settings':
            return <PlannerSidebarSettings />;
    }
};

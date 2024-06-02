import { SidebarSections } from './PlannerSidebar.tsx';
import { PlannerSidebarDocuments } from './PlannerSidebarDocuments.tsx';
import { PlannerSidebarSettings } from './PlannerSidebarSettings.tsx';
import { SimpleFileUploadSection } from './SimpleFileUploadSection.tsx';

export const PlannerSidebarSimpleContent = ({ selectedSection }: { selectedSection: SidebarSections }) => {
    switch (selectedSection) {
        case 'segments':
            return <SimpleFileUploadSection />;
        case 'documents':
            return <PlannerSidebarDocuments />;
        case 'settings':
            return <PlannerSidebarSettings />;
    }
};

import { PlannerSidebarSettings } from './PlannerSidebarSettings.tsx';
import { SimpleFileUploadSection } from './SimpleFileUploadSection.tsx';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../store/layout.reducer.ts';

export const PlannerSidebarSimpleContent = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    switch (selectedSection) {
        case 'segments':
            return <SimpleFileUploadSection />;
        case 'settings':
            return <PlannerSidebarSettings />;
    }
};

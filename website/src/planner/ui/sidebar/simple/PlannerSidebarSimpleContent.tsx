import { SimpleFileUploadSection } from '../../SimpleFileUploadSection.tsx';
import { useSelector } from 'react-redux';
import { getSelectedSidebarSection } from '../../../store/layout.reducer.ts';
import { PlannerSidebarSimpleSettings } from '../PlannerSidebarSimpleSettings.tsx';

export const PlannerSidebarSimpleContent = () => {
    const selectedSection = useSelector(getSelectedSidebarSection);
    switch (selectedSection) {
        case 'simpleTrack':
            return <SimpleFileUploadSection />;
        case 'settings':
            return <PlannerSidebarSimpleSettings />;
    }
};

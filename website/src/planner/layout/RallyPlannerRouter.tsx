import { WizardStartPage } from './WizardStartPage.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';
import { WizardsComplexity } from '../wizard/WizardComplexity.tsx';
import { WizardVersions } from '../wizard/WizardVersions.tsx';
import { MainPlannerUi } from '../ui/MainPlannerUi.tsx';
import { useLoadPlanningFromServer } from '../useLoadPlanningFromServer.tsx';

export const RallyPlannerRouter = () => {
    useLoadPlanningFromServer();
    const selectedSection = useSelector(getSelectionSection);

    switch (selectedSection) {
        case 'menu':
            return <WizardStartPage />;
        case 'wizard-complexity':
            return <WizardsComplexity />;
        case 'wizard-versions':
            return <WizardVersions />;
        default:
            return <MainPlannerUi />;
    }
};

import { WizardStartPage } from './WizardStartPage.tsx';
import { WizardsComplexity } from '../wizard/WizardComplexity.tsx';
import { WizardVersions } from '../wizard/WizardVersions.tsx';
import { MainPlannerUi } from '../ui/MainPlannerUi.tsx';
import { useLoadPlanningFromServer } from '../useLoadPlanningFromServer.tsx';
import { useGetUrlParam } from '../../utils/linkUtil.ts';

export const RallyPlannerRouter = () => {
    useLoadPlanningFromServer();
    const section = useGetUrlParam('section=');
    const planningId = useGetUrlParam('planning=');

    if (!section && planningId) {
        return <MainPlannerUi />;
    }

    switch (section) {
        case 'menu':
            return <WizardStartPage />;
        case 'wizard-complexity':
            return <WizardsComplexity />;
        case 'wizard-versions':
            return <WizardVersions />;
        case 'gps':
            return <MainPlannerUi />;
        default:
            return <WizardStartPage />;
    }
};

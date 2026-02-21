import { WizardStartPage } from '../ui/wizard/WizardStartPage.tsx';
import { WizardsComplexity } from '../ui/wizard/WizardComplexity.tsx';
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
        case 'gps':
            return <MainPlannerUi />;
        default:
            return <WizardStartPage />;
    }
};

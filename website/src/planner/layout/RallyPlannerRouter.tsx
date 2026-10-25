import { WizardStartPage } from '../ui/wizard/WizardStartPage';
import { WizardsComplexity } from '../ui/wizard/WizardComplexity';
import { MainPlannerUi } from '../ui/MainPlannerUi';
import { useGetUrlParam } from '../../utils/linkUtil';

export const RallyPlannerRouter = () => {
    const section = useGetUrlParam('section');
    const planningId = useGetUrlParam('planning');

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

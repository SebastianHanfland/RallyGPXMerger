import { WizardStartPage } from './WizardStartPage.tsx';
import { WizardParameters } from '../wizard/WizardParameters.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';
import { WizardSegments } from '../wizard/WizardSegments.tsx';
import { WizardsComplexity } from '../wizard/WizardComplexity.tsx';
import { WizardTracks } from '../wizard/WizardTracks.tsx';
import { WizardVersions } from '../wizard/WizardVersions.tsx';
import { PlannerWrapper } from './PlannerWrapper.tsx';
import { MainPlannerUi } from '../ui/MainPlannerUi.tsx';

const oldUi = false;
export const RallyPlannerRouter = () => {
    const selectedSection = useSelector(getSelectionSection);

    switch (selectedSection) {
        case 'menu':
            return <WizardStartPage />;
        case 'wizard-parameters':
            return <WizardParameters />;
        case 'wizard-segments':
            return <WizardSegments />;
        case 'wizard-complexity':
            return <WizardsComplexity />;
        case 'wizard-tracks':
            return <WizardTracks />;
        case 'wizard-versions':
            return <WizardVersions />;
        default:
            return oldUi ? <PlannerWrapper /> : <MainPlannerUi />;
    }
};

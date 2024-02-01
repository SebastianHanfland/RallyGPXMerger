import { StartPage } from './StartPage.tsx';
import { AppFooter } from './Footer.tsx';
import { MergeAndMap } from './MergeAndMap.tsx';
import { AppHeader } from './Header.tsx';
import { Sections } from './types.ts';
import { WizardParameters } from '../wizard/WizardParameters.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';
import { WizardSegments } from '../wizard/WizardSegments.tsx';

function isFreshStart(selectedSection: Sections): boolean {
    return selectedSection === 'start';
}

export const RallyPlannerRouter = () => {
    const selectedSection = useSelector(getSelectionSection);

    if (isFreshStart(selectedSection)) {
        return <StartPage />;
    }

    if (selectedSection === 'wizard-parameters') {
        return <WizardParameters />;
    }

    if (selectedSection === 'wizard-segments') {
        return <WizardSegments />;
    }

    return (
        <>
            <AppHeader />
            <MergeAndMap />
            <AppFooter />
        </>
    );
};

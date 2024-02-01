import { StartPage } from './StartPage.tsx';
import { AppFooter } from './Footer.tsx';
import { MergeAndMap } from './MergeAndMap.tsx';
import { AppHeader } from './Header.tsx';
import { useState } from 'react';
import { Sections } from './types.ts';
import { WizardParameters } from '../wizard/WizardParameters.tsx';

function isFreshStart(selectedSection: Sections): boolean {
    return selectedSection === 'start';
}

export const RallyPlannerRouter = () => {
    const [selectedSection, setSelectedSection] = useState<Sections>('start');

    if (isFreshStart(selectedSection)) {
        return <StartPage setSelectedSection={setSelectedSection} />;
    }

    if (selectedSection === 'wizard-parameters') {
        return <WizardParameters />;
    }
    return (
        <>
            <AppHeader selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
            <MergeAndMap selectedSection={selectedSection} />
            <AppFooter />
        </>
    );
};

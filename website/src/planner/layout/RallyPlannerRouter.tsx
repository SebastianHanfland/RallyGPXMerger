import { WizardStartPage } from './WizardStartPage.tsx';
import { AppFooter } from './Footer.tsx';
import { MergeAndMap } from './MergeAndMap.tsx';
import { AppHeader } from './Header.tsx';
import { WizardParameters } from '../wizard/WizardParameters.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';
import { WizardSegments } from '../wizard/WizardSegments.tsx';
import { Container } from 'react-bootstrap';
import { WizardsComplexity } from '../wizard/WizardComplexity.tsx';
import { WizardTracks } from '../wizard/WizardTracks.tsx';
import { WizardVersions } from '../wizard/WizardVersions.tsx';
import { Dashboard } from './dashboard/Dashboard.tsx';
import { FloatingInfoButton } from '../FloatingInfoButton.tsx';

export const RallyPlannerRouter = () => {
    const selectedSection = useSelector(getSelectionSection);

    if (selectedSection === 'menu') {
        return <WizardStartPage />;
    }

    if (selectedSection === 'wizard-parameters') {
        return <WizardParameters />;
    }

    if (selectedSection === 'wizard-segments') {
        return <WizardSegments />;
    }

    if (selectedSection === 'wizard-complexity') {
        return <WizardsComplexity />;
    }

    if (selectedSection === 'wizard-tracks') {
        return <WizardTracks />;
    }

    if (selectedSection === 'wizard-versions') {
        return <WizardVersions />;
    }

    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: '30px', position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0'}>
                    <AppHeader />
                    <MergeAndMap />
                    <AppFooter />
                </Container>
            </div>
            <FloatingInfoButton />
            <Dashboard />
        </>
    );
};

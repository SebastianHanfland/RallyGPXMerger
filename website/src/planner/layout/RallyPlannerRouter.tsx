import { StartPage } from './StartPage.tsx';
import { AppFooter } from './Footer.tsx';
import { MergeAndMap } from './MergeAndMap.tsx';
import { AppHeader } from './Header.tsx';
import { WizardParameters } from '../wizard/WizardParameters.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectionSection, layoutActions } from '../store/layout.reducer.ts';
import { WizardSegments } from '../wizard/WizardSegments.tsx';
import { Container } from 'react-bootstrap';
import { getArrivalDateTime } from '../store/trackMerge.reducer.ts';
import { useEffect } from 'react';
import { Sections } from './types.ts';

export const RallyPlannerRouter = () => {
    const selectedSection = useSelector(getSelectionSection);
    const arrivalDateTime = useSelector(getArrivalDateTime);

    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    useEffect(() => {
        if (selectedSection === 'start' && !!arrivalDateTime) {
            setSelectedSection('gps');
        }
    }, [arrivalDateTime, selectedSection]);

    const isFreshStart = selectedSection === 'start' && !arrivalDateTime;
    if (isFreshStart) {
        return <StartPage />;
    }

    if (selectedSection === 'wizard-parameters') {
        return <WizardParameters />;
    }

    if (selectedSection === 'wizard-segments') {
        return <WizardSegments />;
    }

    return (
        <Container fluid className={'m-0'}>
            <AppHeader />
            <MergeAndMap />
            <AppFooter />
        </Container>
    );
};

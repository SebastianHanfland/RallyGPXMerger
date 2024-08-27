import { Container } from 'react-bootstrap';
import { InteractionMap } from '../map/InteractionMap.tsx';
import { PlannerSidebar } from './PlannerSidebar.tsx';
import { MapContentSelection } from '../map/MapContentSelection.tsx';
import { PlannerHomeButton } from './PlannerHomeButton.tsx';
import { TimeSlider } from '../map/TimeSlider.tsx';
import { DefaultArrivalDateWarning } from './DefaultArrivalDateWarning.tsx';
import { CalculationIsRunning } from './CalculationIsRunning.tsx';
import { CalculationOnTheFly } from './CalculationOnTheFly.tsx';
import { LanguageSelection } from '../layout/LanguageSelection.tsx';
import { CleanDataButton } from '../layout/CleanDataButton.tsx';
import { UploadDataButton } from '../layout/UploadDataButton.tsx';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';

export const MainPlannerUi = () => {
    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: 0, position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0 p-0'}>
                    <InteractionMap />
                </Container>
                <DefaultArrivalDateWarning />
                <CalculationIsRunning />
                <CalculationOnTheFly />
                <MapContentSelection />
                <PlannerHomeButton />
                <TimeSlider />
                <LanguageSelection />
                <SharePlanningButton />
                <CleanDataButton />
                <UploadDataButton />
            </div>
            <PlannerSidebar />
        </>
    );
};

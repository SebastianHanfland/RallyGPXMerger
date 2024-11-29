import { Container } from 'react-bootstrap';
import { InteractionMap } from '../map/InteractionMap.tsx';
import { PlannerSidebar } from './PlannerSidebar.tsx';
import { MapContentSelection } from '../map/MapContentSelection.tsx';
import { PlannerHomeButton } from './PlannerHomeButton.tsx';
import { TimeSlider } from '../map/TimeSlider.tsx';
import { CalculationIsRunning } from './CalculationIsRunning.tsx';
import { CalculationOnTheFly } from './CalculationOnTheFly.tsx';
import { useSelector } from 'react-redux';
import { isPlanningInProgress } from '../store/planner.selector.ts';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';
import { HelpingTip } from './HelpingTip.tsx';

export const MainPlannerUi = () => {
    const planningInProgress = useSelector(isPlanningInProgress);
    console.log('TODO', planningInProgress);
    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: 0, position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0 p-0'}>
                    <InteractionMap />
                </Container>
                <HelpingTip />
                <CalculationIsRunning />
                <CalculationOnTheFly />
                <MapContentSelection />
                <PlannerHomeButton />
                <TimeSlider />
                <SharePlanningButton onMap={true} />
            </div>
            <PlannerSidebar />
        </>
    );
};

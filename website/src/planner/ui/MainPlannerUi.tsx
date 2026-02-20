import { Container } from 'react-bootstrap';
import { InteractionMap } from '../map/InteractionMap.tsx';
import { PlannerSidebar } from './sidebar/PlannerSidebar.tsx';
import { MapContentSelection } from '../map/MapContentSelection.tsx';
import { PlannerHomeButton } from './elements/PlannerHomeButton.tsx';
import { TimeSlider } from '../map/TimeSlider.tsx';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';
import { HelpingTip } from './elements/HelpingTip.tsx';

export const MainPlannerUi = () => {
    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: 0, position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0 p-0'}>
                    <InteractionMap />
                </Container>
                <HelpingTip />
                <MapContentSelection />
                <PlannerHomeButton />
                <TimeSlider />
                <SharePlanningButton onMap={true} />
            </div>
            <PlannerSidebar />
        </>
    );
};

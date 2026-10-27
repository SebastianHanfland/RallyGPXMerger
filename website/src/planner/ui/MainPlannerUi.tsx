import { Container } from 'react-bootstrap';
import { InteractionMap } from '../map/InteractionMap';
import { PlannerSidebar } from './sidebar/complex/PlannerSidebar';
import { MapContentSelection } from '../map/MapContentSelection';
import { PlannerHomeButton } from './elements/PlannerHomeButton';
import { TimeSlider } from '../map/TimeSlider';
import { SharePlanningButton } from '../sharing/SharePlanningButton';
import { HelpingTip } from './elements/HelpingTip';
import { PlannerCloudActions } from './PlannerCloudActions';
import { PlannerDownloadActions } from './PlannerDownloadActions';
import { AbortStreetSelectionButton } from './elements/AbortStreetSelectionButton';

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
                <div
                    style={{
                        position: 'fixed',
                        left: 10,
                        bottom: 60,
                        zIndex: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <AbortStreetSelectionButton />
                    <PlannerCloudActions onMap={true} />
                    <PlannerDownloadActions onMap={true} />
                    <SharePlanningButton onMap={true} />
                </div>
            </div>
            <PlannerSidebar />
        </>
    );
};

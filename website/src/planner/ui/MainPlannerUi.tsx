import { Container } from 'react-bootstrap';
import { InteractionMap } from '../map/InteractionMap.tsx';
import { PlannerSidebar } from './sidebar/PlannerSidebar.tsx';
import { MapContentSelection } from '../map/MapContentSelection.tsx';
import { PlannerHomeButton } from './elements/PlannerHomeButton.tsx';
import { TimeSlider } from '../map/TimeSlider.tsx';
import { SharePlanningButton } from '../sharing/SharePlanningButton.tsx';
import { HelpingTip } from './elements/HelpingTip.tsx';
import { PlannerCloudActions } from './PlannerCloudActions.tsx';
import { PlannerDownloadActions } from './PlannerDownloadActions.tsx';
import { useSelector } from 'react-redux';
import { getHasSingleTrack } from '../store/layout.reducer.ts';

export const MainPlannerUi = () => {
    const hasSingleTrack = useSelector(getHasSingleTrack);
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
                    {!hasSingleTrack && (
                        <>
                            <PlannerCloudActions onMap={true} />
                            <PlannerDownloadActions onMap={true} />
                        </>
                    )}
                    <SharePlanningButton onMap={true} />
                </div>
            </div>
            <PlannerSidebar />
        </>
    );
};

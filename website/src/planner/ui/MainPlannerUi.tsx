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
import { RemoveUploadedDataButton } from '../layout/RemoveUploadedDataButton.tsx';
import { useEffect } from 'react';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { useSelector } from 'react-redux';
import { isPlanningInProgress } from '../store/planner.selector.ts';
import { DownloadDataButton } from '../layout/DownloadDataButton.tsx';
import { PasswordButton } from '../layout/PasswordButton.tsx';
import { NoTitleWarning } from './NoTitleWarning.tsx';
import { HelpButton } from '../layout/HelpButton.tsx';

export const MainPlannerUi = () => {
    const planningInProgress = useSelector(isPlanningInProgress);

    useEffect(() => {
        return () => {
            if (!planningInProgress) {
                history.replaceState(null, '', `${getBaseUrl()}`);
            }
        };
    }, []);
    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: 0, position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0 p-0'}>
                    <InteractionMap />
                </Container>
                <DefaultArrivalDateWarning />
                <NoTitleWarning />
                <CalculationIsRunning />
                <CalculationOnTheFly />
                <MapContentSelection />
                <PlannerHomeButton />
                <TimeSlider />
                <LanguageSelection />
                <SharePlanningButton />
                <PasswordButton />
                <RemoveUploadedDataButton />
                <CleanDataButton />
                <DownloadDataButton />
                <UploadDataButton />
                <HelpButton />
            </div>
            <PlannerSidebar />
        </>
    );
};
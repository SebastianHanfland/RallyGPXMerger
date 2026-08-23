import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary.tsx';
import { RallyPlannerWrapper } from './planner/RallyPlanner.tsx';
import { RallyDisplayWrapper } from './display/RallyDisplayWrapper.tsx';
import { RallyTableWrapper } from './display/RallyTableWrapper.tsx';
import { RallyComparisonWrapper } from './comparison/RallyComparisonWrapper.tsx';
import { useGetUrlParam } from './utils/linkUtil.ts';
import { planningStore } from './planner/store/planningStore.ts';
import { displayStore } from './display/store/store.ts';
import { comparisonStore } from './comparison/store/store.ts';
import { Imprint } from './Imprint.tsx';
import { StreetPathMapWrapper } from './street-path/StreetPathMap.tsx';

export function App() {
    const hasStreetPathUrl = useGetUrlParam('streetpath=');
    const hasStreetName = useGetUrlParam('streetname=');
    const hasComparisonUrl = useGetUrlParam('comparison=');
    const hasDisplayUrl = useGetUrlParam('display=');
    const hasTableUrl = useGetUrlParam('table=');
    const hasImprintUrl = useGetUrlParam('imprint=');

    if (hasStreetPathUrl) {
        return (
            <ErrorBoundary>
                <StreetPathMapWrapper encodedPath={hasStreetPathUrl ?? ''} streetName={hasStreetName} />
            </ErrorBoundary>
        );
    }
    if (hasImprintUrl) {
        return <Imprint />;
    }
    if (hasComparisonUrl) {
        return <ErrorBoundary>{<RallyComparisonWrapper store={comparisonStore} />}</ErrorBoundary>;
    }
    if (hasTableUrl) {
        return <ErrorBoundary>{<RallyTableWrapper store={displayStore} />}</ErrorBoundary>;
    }
    if (hasDisplayUrl) {
        return <ErrorBoundary>{<RallyDisplayWrapper store={displayStore} />}</ErrorBoundary>;
    } else {
        return <ErrorBoundary>{<RallyPlannerWrapper store={planningStore} />}</ErrorBoundary>;
    }
}

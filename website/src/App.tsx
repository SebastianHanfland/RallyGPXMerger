import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary';
import { RallyPlannerWrapper } from './planner/RallyPlanner';
import { RallyDisplayWrapper } from './display/RallyDisplayWrapper';
import { RallyTableWrapper } from './display/RallyTableWrapper';
import { RallyComparisonWrapper } from './comparison/RallyComparisonWrapper';
import { useGetUrlParam } from './utils/linkUtil';
import { planningStore } from './planner/store/planningStore';
import { displayStore } from './display/store/store';
import { comparisonStore } from './comparison/store/store';
import { Imprint } from './Imprint';
import { StreetPathMapWrapper } from './street-path/StreetPathMap';

export function App() {
    const streetPath = useGetUrlParam('streetpath');
    const streetName = useGetUrlParam('streetname');
    const hasComparisonUrl = useGetUrlParam('comparison');
    const hasDisplayUrl = useGetUrlParam('display');
    const hasTableUrl = useGetUrlParam('table');
    const hasVerticalTableUrl = useGetUrlParam('vTable');
    const hasImprintUrl = useGetUrlParam('imprint');

    if (streetPath !== undefined) {
        return (
            <ErrorBoundary>
                <StreetPathMapWrapper encodedPath={streetPath} streetName={streetName} />
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
    if (hasVerticalTableUrl) {
        return <ErrorBoundary>{<RallyTableWrapper store={displayStore} vertical />}</ErrorBoundary>;
    }
    if (hasDisplayUrl) {
        return <ErrorBoundary>{<RallyDisplayWrapper store={displayStore} />}</ErrorBoundary>;
    } else {
        return <ErrorBoundary>{<RallyPlannerWrapper store={planningStore} />}</ErrorBoundary>;
    }
}

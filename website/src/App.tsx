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

export function App() {
    const hasComparisonUrl = useGetUrlParam('comparison=');
    const hasDisplayUrl = useGetUrlParam('display=');
    const hasTableUrl = useGetUrlParam('table=');

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

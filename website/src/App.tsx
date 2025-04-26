import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary.tsx';
import { RallyPlannerWrapper } from './planner/RallyPlanner.tsx';
import { RallyDisplayWrapper } from './versions/RallyDisplayWrapper.tsx';
import { RallyTableWrapper } from './versions/RallyTableWrapper.tsx';
import { RallyComparisonWrapper } from './versions/RallyComparisonWrapper.tsx';
import { useGetUrlParam } from './utils/linkUtil.ts';
import { planningStore } from './planner/store/planningStore.ts';
import { versionsStore } from './versions/store/store.ts';

export function App() {
    const hasComparisonUrl = useGetUrlParam('comparison=');
    const hasDisplayUrl = useGetUrlParam('display=');
    const hasTableUrl = useGetUrlParam('table=');

    if (hasComparisonUrl) {
        return <ErrorBoundary>{<RallyComparisonWrapper store={versionsStore} />}</ErrorBoundary>;
    }
    if (hasTableUrl) {
        return <ErrorBoundary>{<RallyTableWrapper store={versionsStore} />}</ErrorBoundary>;
    }
    if (hasDisplayUrl) {
        return <ErrorBoundary>{<RallyDisplayWrapper store={versionsStore} />}</ErrorBoundary>;
    } else {
        return <ErrorBoundary>{<RallyPlannerWrapper store={planningStore} />}</ErrorBoundary>;
    }
}

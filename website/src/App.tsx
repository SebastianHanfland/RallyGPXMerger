import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary.tsx';
import { RallyVersionControl } from './versions/RallyVersionControl.tsx';
import { RallyPlannerWrapper } from './planner/RallyPlanner.tsx';
import { RallyDisplayWrapper } from './versions/RallyDisplayWrapper.tsx';
import { RallyTableWrapper } from './versions/RallyTableWrapper.tsx';
import { RallyComparison } from './versions/RallyComparison.tsx';
import { useGetUrlParam } from './utils/linkUtil.ts';

export function App() {
    const hasExternalUrl = useGetUrlParam('version=');
    const hasComparisonUrl = useGetUrlParam('comparison=');
    const hasDisplayUrl = useGetUrlParam('display=');
    const hasTableUrl = useGetUrlParam('table=');

    if (hasExternalUrl) {
        return <ErrorBoundary>{<RallyVersionControl />}</ErrorBoundary>;
    }
    if (hasComparisonUrl) {
        return <ErrorBoundary>{<RallyComparison />}</ErrorBoundary>;
    }
    if (hasTableUrl) {
        return <ErrorBoundary>{<RallyTableWrapper />}</ErrorBoundary>;
    }
    if (hasDisplayUrl) {
        return <ErrorBoundary>{<RallyDisplayWrapper />}</ErrorBoundary>;
    } else {
        return <ErrorBoundary>{<RallyPlannerWrapper />}</ErrorBoundary>;
    }
}

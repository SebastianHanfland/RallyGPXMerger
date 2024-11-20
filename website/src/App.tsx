import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary.tsx';
import { RallyVersionControl } from './versions/RallyVersionControl.tsx';
import { RallyPlannerWrapper } from './planner/RallyPlanner.tsx';
import { RallyDisplayWrapper } from './versions/RallyDisplayWrapper.tsx';

export function App() {
    const urlParams = window.location.search;
    const hasExternalUrl = urlParams.includes('version=');
    const hasDisplayUrl = urlParams.includes('display=');

    if (hasExternalUrl) {
        return <ErrorBoundary>{<RallyVersionControl />}</ErrorBoundary>;
    }
    if (hasDisplayUrl) {
        return <ErrorBoundary>{<RallyDisplayWrapper />}</ErrorBoundary>;
    } else {
        return <ErrorBoundary>{<RallyPlannerWrapper />}</ErrorBoundary>;
    }
}

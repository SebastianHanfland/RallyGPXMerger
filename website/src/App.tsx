import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { RallyVersionControl } from './versions/RallyVersionControl.tsx';
import { RallyPlaner } from './RallyPlaner.tsx';

export function App() {
    const urlParams = window.location.search;
    const hasExternalUrl = urlParams.includes('?url=');

    return <ErrorBoundary>{hasExternalUrl ? <RallyVersionControl /> : <RallyPlaner />}</ErrorBoundary>;
}

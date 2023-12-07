import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { RallyVersionControl } from './versions/RallyVersionControl.tsx';
import { RallyPlaner } from './RallyPlaner.tsx';

export function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter basename={'/RallyGPXMerger'}>
                <Switch>
                    <Route path={'/versions'} component={RallyVersionControl} />
                    <Route path={'/*'} component={RallyPlaner} />
                </Switch>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

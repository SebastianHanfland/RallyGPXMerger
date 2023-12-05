import { MergeAndMap } from './components/MergeAndMap.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AppFooter } from './components/Footer.tsx';
import { AppHeader } from './components/Header.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';

function RallyPlaner() {
    return (
        <Provider store={store}>
            <AppHeader />
            <MergeAndMap />
            <AppFooter />
        </Provider>
    );
}

function RallyVersionControl() {
    return <div>Version Control</div>;
}

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

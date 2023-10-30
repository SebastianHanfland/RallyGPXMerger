import { MergeAndMap } from './components/MergeAndMap.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AppFooter } from './components/Footer.tsx';
import { AppHeader } from './components/Header.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

export function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <AppHeader />
                <MergeAndMap />
                <AppFooter />
            </Provider>
        </ErrorBoundary>
    );
}

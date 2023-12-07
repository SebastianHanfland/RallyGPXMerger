import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AppHeader } from './components/Header.tsx';
import { MergeAndMap } from './components/MergeAndMap.tsx';
import { AppFooter } from './components/Footer.tsx';

export function RallyPlaner() {
    return (
        <Provider store={store}>
            <AppHeader />
            <MergeAndMap />
            <AppFooter />
        </Provider>
    );
}

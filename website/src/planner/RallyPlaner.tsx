import { Provider } from 'react-redux';
import { store } from './store.ts';
import { AppHeader } from '../components/Header.tsx';
import { MergeAndMap } from '../components/MergeAndMap.tsx';
import { AppFooter } from '../components/Footer.tsx';
import { useState } from 'react';
import { Sections } from '../components/types.ts';

export function RallyPlaner() {
    const [selectedSection, setSelectedSection] = useState<Sections>('gps');

    return (
        <Provider store={store}>
            <AppHeader selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
            <MergeAndMap selectedSection={selectedSection} />
            <AppFooter />
        </Provider>
    );
}

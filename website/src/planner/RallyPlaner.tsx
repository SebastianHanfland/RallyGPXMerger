import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AppHeader } from './layout/Header.tsx';
import { MergeAndMap } from './layout/MergeAndMap.tsx';
import { AppFooter } from './layout/Footer.tsx';
import { useState } from 'react';
import { Sections } from './layout/types.ts';

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

import { Provider } from 'react-redux';
import { iframeStore } from '../store/store.ts';
import { loadZipFileHook } from './loadZipFileHook.ts';
import { DisplayMap } from './DisplayMap.tsx';

function RallyDisplay() {
    loadZipFileHook();

    return <DisplayMap />;
}

export function RallyVersionControl() {
    return (
        <Provider store={iframeStore}>
            <RallyDisplay />
        </Provider>
    );
}

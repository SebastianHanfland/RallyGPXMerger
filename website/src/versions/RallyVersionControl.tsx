import { Provider } from 'react-redux';
import { iframeStore } from '../store/store.ts';
import { loadZipFileHook } from './loadZipFileHook.ts';
import { DisplayMap } from './DisplayMap.tsx';
import { parseCalculatedTracksHook } from '../components/map/hooks/parseCalculatedTracksHook.ts';

function RallyDisplay() {
    loadZipFileHook();
    parseCalculatedTracksHook();

    return <DisplayMap />;
}

export function RallyVersionControl() {
    return (
        <Provider store={iframeStore}>
            <RallyDisplay />
        </Provider>
    );
}

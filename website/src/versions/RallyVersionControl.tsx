import { Provider, useSelector } from 'react-redux';
import { iframeStore } from '../store/store.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { loadZipFileHook } from './loadZipFileHook.ts';

function RallyDisplay() {
    const calculatedTracks = useSelector(getCalculatedTracks);
    loadZipFileHook();
    return calculatedTracks.map((track) => <div>{track.id}</div>);
}

export function RallyVersionControl() {
    return (
        <Provider store={iframeStore}>
            <RallyDisplay />
        </Provider>
    );
}

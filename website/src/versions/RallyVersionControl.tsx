import { Provider, useSelector } from 'react-redux';
import { loadZipFileHook } from './loadZipFileHook.ts';
import { DisplayMap } from './DisplayMap.tsx';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar.tsx';
import { getIsZipLoading } from './store/zipTracks.reducer.ts';
import { versionsStore } from './store/store.ts';

function RallyDisplay() {
    loadZipFileHook();
    const isLoading = useSelector(getIsZipLoading);

    if (isLoading) {
        return <div>Loading</div>;
    }

    return (
        <Container fluid>
            <NavigationBar />
            <DisplayMap />
        </Container>
    );
}

export function RallyVersionControl() {
    return (
        <Provider store={versionsStore}>
            <RallyDisplay />
        </Provider>
    );
}

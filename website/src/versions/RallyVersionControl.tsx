import { Provider } from 'react-redux';
import { iframeStore } from '../store/store.ts';
import { loadZipFileHook } from './loadZipFileHook.ts';
import { DisplayMap } from './DisplayMap.tsx';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar.tsx';

function RallyDisplay() {
    loadZipFileHook();

    return (
        <Container fluid>
            <NavigationBar />
            <DisplayMap />
        </Container>
    );
}

export function RallyVersionControl() {
    return (
        <Provider store={iframeStore}>
            <RallyDisplay />
        </Provider>
    );
}

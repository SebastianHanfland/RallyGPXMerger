import { Provider, useSelector } from 'react-redux';
import { loadFilesHook } from './data/loadFilesHook.ts';
import { ComparisonMap } from './map/ComparisonMap.tsx';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar.tsx';
import { getIsZipLoading } from './store/zipTracks.reducer.ts';
import { versionsStore } from './store/store.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { versionKey, versions } from './versionLinks.ts';
import { PresentationMap } from './map/PresentationMap.tsx';

function RallyDisplay() {
    loadFilesHook();
    const isLoading = useSelector(getIsZipLoading);

    if (isLoading) {
        return (
            <div>
                <FormattedMessage id={'msg.loading'} />
            </div>
        );
    }

    if (versions[versionKey].length === 1) {
        return (
            <Container fluid>
                <PresentationMap />
            </Container>
        );
    }

    return (
        <Container fluid>
            <NavigationBar />
            <ComparisonMap />
        </Container>
    );
}

export function RallyVersionControl() {
    return (
        <Provider store={versionsStore}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyDisplay />
            </IntlProvider>
        </Provider>
    );
}

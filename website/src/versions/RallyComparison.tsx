import { Provider, useSelector } from 'react-redux';
import { ComparisonMap } from './map/ComparisonMap.tsx';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar.tsx';
import { getIsZipLoading } from './store/zipTracks.reducer.ts';
import { versionsStore } from './store/store.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useLoadPlannings } from './data/loadPlanningHook.ts';

function RallyDisplay() {
    const planningIds = useGetUrlParam('comparison=')?.split(',') ?? [];
    useLoadPlannings(planningIds);
    const isLoading = useSelector(getIsZipLoading);

    if (isLoading) {
        return (
            <div>
                <FormattedMessage id={'msg.loading'} />
            </div>
        );
    }

    if (planningIds.length < 2) {
        return (
            <div>
                <FormattedMessage id={'msg.moreIds'} />
            </div>
        );
    }

    return (
        <Container fluid>
            <NavigationBar />
            <ComparisonMap />
        </Container>
    );
}

export function RallyComparison() {
    return (
        <Provider store={versionsStore}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyDisplay />
            </IntlProvider>
        </Provider>
    );
}

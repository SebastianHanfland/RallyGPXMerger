import { Provider, useSelector } from 'react-redux';
import { ComparisonMap } from './map/ComparisonMap';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar';
import { getIsComparisonLoading } from './store/tracks.reducer';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language';
import { getMessages } from '../lang/getMessages';
import { useGetUrlParam } from '../utils/linkUtil';
import { Store } from '@reduxjs/toolkit';
import { useLoadPlanningsHook } from './data/useLoadPlanningsHook';

function RallyComparison() {
    const planningIds = useGetUrlParam('comparison')?.split(',') ?? [];
    useLoadPlanningsHook(planningIds);
    const isLoading = useSelector(getIsComparisonLoading);

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

export function RallyComparisonWrapper({ store }: { store: Store }) {
    return (
        <Provider store={store}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyComparison />
            </IntlProvider>
        </Provider>
    );
}

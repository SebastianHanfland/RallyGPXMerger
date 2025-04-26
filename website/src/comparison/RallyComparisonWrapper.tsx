import { Provider, useSelector } from 'react-redux';
import { ComparisonMap } from './map/ComparisonMap.tsx';
import { Container } from 'react-bootstrap';
import { NavigationBar } from './NavigationBar.tsx';
import { getIsComparisonLoading } from './store/tracks.reducer.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { Store } from '@reduxjs/toolkit';
import { useLoadPlanningsHook } from './data/useLoadPlanningsHook.ts';

function RallyComparison() {
    const planningIds = useGetUrlParam('comparison=')?.split(',') ?? [];
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

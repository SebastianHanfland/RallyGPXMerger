import { Provider, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language';
import { getMessages } from '../lang/getMessages';
import { PresentationMap } from './map/PresentationMap';
import { PresentationMenu } from './menu/PresentationMenu';
import { useGetUrlParam } from '../utils/linkUtil';
import { useLoadPlanningById } from './data/loadPlanningHook';
import { Store } from '@reduxjs/toolkit';
import { getIsDisplayMapLoading } from './store/displayMapReducer';

function RallyDisplay() {
    const planningId = useGetUrlParam('display');
    useLoadPlanningById(planningId);

    const isLoading = useSelector(getIsDisplayMapLoading);

    if (isLoading) {
        return (
            <div>
                <FormattedMessage id={'msg.loading'} />
            </div>
        );
    }

    return (
        <Container fluid className={'p-0'}>
            <PresentationMap />
            <PresentationMenu />
        </Container>
    );
}

export function RallyDisplayWrapper({ store }: { store: Store }) {
    return (
        <Provider store={store}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyDisplay />
            </IntlProvider>
        </Provider>
    );
}

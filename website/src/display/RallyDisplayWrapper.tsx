import { Provider, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { getIsDisplayLoading } from './store/displayTracksReducer.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { PresentationMap } from './map/PresentationMap.tsx';
import { PresentationMenu } from './menu/PresentationMenu.tsx';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useLoadPlanningById } from './data/loadPlanningHook.ts';
import { Store } from '@reduxjs/toolkit';

function RallyDisplay() {
    const planningId = useGetUrlParam('display=');
    useLoadPlanningById(planningId);

    const isLoading = useSelector(getIsDisplayLoading);

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

import { Provider, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { PresentationTable } from './table/PresentationTable.tsx';
import { useLoadPlanningById } from './data/loadPlanningHook.ts';
import { Store } from '@reduxjs/toolkit';
import { getIsDisplayMapLoading } from './store/displayMapReducer.ts';

function RallyTable() {
    const planningId = useGetUrlParam('table=');
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
            <PresentationTable />
        </Container>
    );
}

export function RallyTableWrapper({ store }: { store: Store }) {
    return (
        <Provider store={store}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyTable />
            </IntlProvider>
        </Provider>
    );
}

import { Provider, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language';
import { getMessages } from '../lang/getMessages';
import { useGetUrlParam } from '../utils/linkUtil';
import { PresentationTable } from './table/PresentationTable';
import { VerticalPresentationTable } from './table/VerticalPresentationTable';
import { useLoadPlanningById } from './data/loadPlanningHook';
import { Store } from '@reduxjs/toolkit';
import { getIsDisplayMapLoading } from './store/displayMapReducer';

function RallyTable() {
    const planningId = useGetUrlParam('table');
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

function RallyVerticalTable() {
    const planningId = useGetUrlParam('vTable');
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
            <VerticalPresentationTable />
        </Container>
    );
}

export function RallyTableWrapper({ store, vertical = false }: { store: Store; vertical?: boolean }) {
    return (
        <Provider store={store}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                {vertical ? <RallyVerticalTable /> : <RallyTable />}
            </IntlProvider>
        </Provider>
    );
}

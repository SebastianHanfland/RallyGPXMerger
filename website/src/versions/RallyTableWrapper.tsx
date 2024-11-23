import { Provider, useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { getIsZipLoading, zipTracksActions } from './store/zipTracks.reducer.ts';
import { versionsStore } from './store/store.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { getUrlParam } from '../utils/linkUtil.ts';
import { useEffect } from 'react';
import { setStartAndEndTime } from './data/loadFilesHook.ts';
import { loadServerFile } from './data/loadServerFile.ts';
import { PresentationTable } from './table/PresentationTable.tsx';

function RallyTable() {
    const planningId = getUrlParam('table=');
    const dispatch = useDispatch();

    console.log(planningId);

    useEffect(() => {
        if (planningId) {
            dispatch(zipTracksActions.removeZipTracks());
            dispatch(zipTracksActions.setIsLoading(true));

            loadServerFile(planningId, dispatch).then(() => {
                dispatch(zipTracksActions.setIsLoading(false));
                setStartAndEndTime(dispatch);
            });
        }
    }, [planningId]);

    const isLoading = useSelector(getIsZipLoading);

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

export function RallyTableWrapper() {
    return (
        <Provider store={versionsStore}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyTable />
            </IntlProvider>
        </Provider>
    );
}

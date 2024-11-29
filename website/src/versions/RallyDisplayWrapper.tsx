import { Provider, useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { getIsZipLoading, zipTracksActions } from './store/zipTracks.reducer.ts';
import { versionsStore } from './store/store.ts';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';
import { PresentationMap } from './map/PresentationMap.tsx';
import { PresentationMenu } from './menu/PresentationMenu.tsx';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useEffect } from 'react';
import { setStartAndEndTime } from './data/loadFilesHook.ts';
import { loadServerFile } from './data/loadServerFile.ts';

function RallyDisplay() {
    const planningId = useGetUrlParam('display=');
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
            <PresentationMap />
            <PresentationMenu />
        </Container>
    );
}

export function RallyDisplayWrapper() {
    return (
        <Provider store={versionsStore}>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                <RallyDisplay />
            </IntlProvider>
        </Provider>
    );
}

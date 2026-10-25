import '../App.css';
import { Provider, useSelector } from 'react-redux';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter';
import { getDisplayLanguage } from './store/layout.reducer';
import { getMessages } from '../lang/getMessages';
import { IntlProvider } from 'react-intl';
import { getLanguage } from '../language';
import { AppFooter } from './layout/Footer';
import { ToastWrapper } from './toasts/ToastWrapper';
import { Store } from '@reduxjs/toolkit';
import { LoadingDataFromServerModal } from './loading/LoadingDataFromServerModal';
import { TitleSetter } from './layout/TitleSetter';
import { SharePlanningModal } from './sharing/SharePlanningModal';

export function RallyPlanner() {
    const language = useSelector(getDisplayLanguage);

    return (
        <IntlProvider locale={language ?? getLanguage()} messages={getMessages(language)}>
            <TitleSetter />
            <ToastWrapper />
            <RallyPlannerRouter />
            <SharePlanningModal />
            <LoadingDataFromServerModal />
            <AppFooter />
        </IntlProvider>
    );
}

export function RallyPlannerWrapper({ store }: { store: Store }) {
    return (
        <Provider store={store}>
            <RallyPlanner />
        </Provider>
    );
}

import '../App.css';
import { Provider, useSelector } from 'react-redux';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { getDisplayLanguage } from './store/layout.reducer.ts';
import { getMessages } from '../lang/getMessages.ts';
import { IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { AppFooter } from './layout/Footer.tsx';
import { ToastWrapper } from './toasts/ToastWrapper.tsx';
import { Store } from '@reduxjs/toolkit';
import { UseLoadPlanningFromServer } from './useLoadPlanningFromServer.tsx';

export function RallyPlanner() {
    const language = useSelector(getDisplayLanguage);

    return (
        <IntlProvider locale={language ?? getLanguage()} messages={getMessages(language)}>
            <ToastWrapper />
            <RallyPlannerRouter />
            <UseLoadPlanningFromServer />
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

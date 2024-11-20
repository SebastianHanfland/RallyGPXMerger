import '../App.css';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store.ts';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { getDisplayLanguage } from './store/layout.reducer.ts';
import { getMessages } from '../lang/getMessages.ts';
import { IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { AppFooter } from './layout/Footer.tsx';
import { ToastWrapper } from './toasts/ToastWrapper.tsx';

export function RallyPlanner() {
    const language = useSelector(getDisplayLanguage);

    return (
        <IntlProvider locale={language ?? getLanguage()} messages={getMessages(language)}>
            <ToastWrapper />
            <RallyPlannerRouter />
            <AppFooter />
        </IntlProvider>
    );
}

export function RallyPlannerWrapper() {
    return (
        <Provider store={store}>
            <RallyPlanner />
        </Provider>
    );
}

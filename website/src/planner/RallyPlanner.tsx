import '../App.css';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store.ts';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { getDisplayLanguage } from './store/layout.reducer.ts';
import { getMessages } from '../lang/getMessages.ts';
import { IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';

export function RallyPlanner() {
    const language = useSelector(getDisplayLanguage);
    return (
        <IntlProvider locale={language ?? getLanguage()} messages={getMessages()}>
            <RallyPlannerRouter />
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

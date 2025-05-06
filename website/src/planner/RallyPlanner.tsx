import '../App.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { getDisplayLanguage } from './store/layout.reducer.ts';
import { getMessages } from '../lang/getMessages.ts';
import { IntlProvider } from 'react-intl';
import { getLanguage } from '../language.ts';
import { AppFooter } from './layout/Footer.tsx';
import { ToastWrapper } from './toasts/ToastWrapper.tsx';
import { Store } from '@reduxjs/toolkit';
import { AppDispatch } from './store/planningStore.ts';
import { useEffect } from 'react';
import { useGetUrlParam } from '../utils/linkUtil.ts';
import { createAndStoreReadablePoints } from './useLoadPlanningFromServer.tsx';

export function RallyPlanner() {
    const language = useSelector(getDisplayLanguage);
    const planningId = useGetUrlParam('planning=') ?? 'current';
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(createAndStoreReadablePoints(planningId));
    }, []);

    return (
        <IntlProvider locale={language ?? getLanguage()} messages={getMessages(language)}>
            <ToastWrapper />
            <RallyPlannerRouter />
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

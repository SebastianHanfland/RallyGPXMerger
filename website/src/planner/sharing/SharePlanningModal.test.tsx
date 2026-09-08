import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createPlanningStore } from '../store/planningStore.ts';
import { backendActions } from '../store/backend.reducer.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { SharePlanningButton } from './SharePlanningButton.tsx';
import { SharePlanningModal } from './SharePlanningModal.tsx';
import { getMessages } from '../../lang/getMessages.ts';

describe('Share planning modal', () => {
    it('opens from the button and closes through the shared layout state', async () => {
        const store = createPlanningStore();
        store.dispatch(backendActions.setPlanningId('planning-id'));
        store.dispatch(backendActions.setIsPlanningSaved(true));

        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <SharePlanningButton />
                    <SharePlanningModal />
                </IntlProvider>
            </Provider>
        );

        const user = userEvent.setup();
        expect(screen.queryByRole('dialog')).toBeNull();

        await user.click(screen.getByTitle('Share planning'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(store.getState().layout.isShareModalOpen).toBe(true);

        await user.click(within(screen.getByRole('dialog')).getByText('Close'));
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(store.getState().layout.isShareModalOpen).toBe(false);
    });

    it('renders an already-open modal from layout state', () => {
        const store = createPlanningStore();
        store.dispatch(backendActions.setPlanningId('planning-id'));
        store.dispatch(backendActions.setIsPlanningSaved(true));
        store.dispatch(layoutActions.setIsShareModalOpen(true));

        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <SharePlanningModal />
                </IntlProvider>
            </Provider>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

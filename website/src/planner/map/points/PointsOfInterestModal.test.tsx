import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createPlanningStore } from '../../store/planningStore.ts';
import { pointsActions } from '../../store/points.reducer.ts';
import { getMessages } from '../../../lang/getMessages.ts';
import { PointsOfInterestModal } from './PointsOfInterestModal.tsx';

describe('Points of interest modal', () => {
    it('uses the creation defaults and groups the type options', async () => {
        const store = createPlanningStore();
        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <PointsOfInterestModal />
                </IntlProvider>
            </Provider>
        );

        store.dispatch(pointsActions.setContextMenuPoint({ lat: 48, lng: 11 }));

        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
        expect(screen.getByDisplayValue('200')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();

        await userEvent.setup().click(screen.getByText('Other'));

        expect(screen.getByText('Open points')).toBeInTheDocument();
        expect(screen.getByText('Internal')).toBeInTheDocument();
        expect(screen.getByText('Public')).toBeInTheDocument();
        expect(screen.getByText('Todo')).toBeInTheDocument();
        expect(screen.getByText('Impediment')).toBeInTheDocument();
        expect(screen.queryByText('Gap')).toBeNull();
        expect(screen.getByText('Public comment')).toBeInTheDocument();
    });
});

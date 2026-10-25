import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { getMessages } from '../../../lang/getMessages';
import { createPlanningStore } from '../../store/planningStore';
import { mapActions } from '../../store/map.reducer';
import { segmentDataActions, getStreetLookup } from '../../store/segmentData.redux';
import { AbortStreetSelectionButton } from './AbortStreetSelectionButton';

const messages = getMessages('en');

function renderButton() {
    const store = createPlanningStore();
    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <AbortStreetSelectionButton />
            </IntlProvider>
        </Provider>
    );
    return store;
}

describe('AbortStreetSelectionButton', () => {
    it('is hidden when no street selection is active', () => {
        renderButton();

        expect(screen.queryByRole('button', { name: messages['msg.abortStreetAssignment'] })).not.toBeInTheDocument();
    });

    it('clears an active new street selection and its temporary lookup', () => {
        const store = renderButton();
        act(() => {
            store.dispatch(segmentDataActions.addStreetLookup({ 2: undefined }));
            store.dispatch(segmentDataActions.addPostCodeLookup({ 2: undefined }));
            store.dispatch(segmentDataActions.addDistrictLookup({ 2: undefined }));
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'track',
                    streetIndex: 2,
                    boundary: 'start',
                    mode: 'add-start',
                    range: { start: 0, end: 1 },
                })
            );
        });

        const abortButton = screen.getByRole('button', { name: messages['msg.abortStreetAssignment'] });
        expect(abortButton).toHaveClass('btn-danger');
        expect(abortButton).toHaveAttribute('title', messages['msg.abortStreetAssignment']);

        act(() => abortButton.click());

        expect(screen.queryByRole('button', { name: messages['msg.abortStreetAssignment'] })).not.toBeInTheDocument();
        expect(store.getState().map.streetPointSelection).toBeUndefined();
        expect(getStreetLookup(store.getState())).not.toHaveProperty('2');
    });

    it('aborts an active street selection when Escape is pressed', () => {
        const store = renderButton();
        act(() => {
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'track',
                    streetIndex: 1,
                    boundary: 'start',
                    range: { start: 0, end: 1 },
                })
            );
        });

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(store.getState().map.streetPointSelection).toBeUndefined();
        expect(screen.queryByRole('button', { name: messages['msg.abortStreetAssignment'] })).not.toBeInTheDocument();
    });

    it('does not react to Escape when no street selection is active', () => {
        const store = renderButton();

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(store.getState().map.streetPointSelection).toBeUndefined();
    });
});

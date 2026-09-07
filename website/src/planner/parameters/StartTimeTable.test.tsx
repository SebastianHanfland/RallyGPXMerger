import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../store/planningStore.ts';
import { trackMergeActions, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getMessages } from '../../lang/getMessages.ts';
import { StartTimeTable } from './StartTimeTable.tsx';

const messages = getMessages('en');

function renderTable() {
    const store = createPlanningStore();
    store.dispatch(
        trackMergeActions.setTracks([
            { id: 'one', name: 'Track 1', segments: [], buffer: 5, rounding: 10 },
            { id: 'two', name: 'Track 2', segments: [], buffer: 15, rounding: 20 },
        ])
    );

    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <StartTimeTable />
            </IntlProvider>
        </Provider>
    );

    return store;
}

describe('StartTimeTable bulk controls', () => {
    it('keeps the bulk controls in one non-wrapping row', () => {
        renderTable();

        expect(screen.getByTestId('start-time-bulk-controls')).toHaveClass('flex-nowrap');
        expect(screen.getByTestId('start-time-bulk-controls')).not.toHaveClass('flex-wrap');
    });

    it('sets the buffer and rounding for every track', async () => {
        const user = userEvent.setup();
        const store = renderTable();

        await user.type(screen.getByRole('spinbutton', { name: messages['msg.buffer'] }), '25');
        await user.click(screen.getByRole('button', { name: messages['msg.setBufferForAllTracks'] }));
        expect(
            screen.getAllByPlaceholderText(messages['msg.buffer']!).map((input) => (input as HTMLInputElement).value)
        ).toEqual(['25', '25']);
        await user.type(screen.getByRole('spinbutton', { name: messages['msg.rounding'] }), '30');
        await user.click(screen.getByRole('button', { name: messages['msg.setRoundingForAllTracks'] }));
        expect(
            screen.getAllByPlaceholderText(messages['msg.rounding']!).map((input) => (input as HTMLInputElement).value)
        ).toEqual(['30', '30']);

        expect(getTrackCompositions(store.getState())).toEqual([
            expect.objectContaining({ buffer: 25, rounding: 30 }),
            expect.objectContaining({ buffer: 25, rounding: 30 }),
        ]);
    });

    it('clears a setting for every track when its bulk input is empty', async () => {
        const user = userEvent.setup();
        const store = renderTable();

        const bufferInput = screen.getByRole('spinbutton', { name: messages['msg.buffer'] });
        await user.type(bufferInput, '25');
        await user.click(screen.getByRole('button', { name: messages['msg.setBufferForAllTracks'] }));
        await user.clear(bufferInput);
        await user.click(screen.getByRole('button', { name: messages['msg.setBufferForAllTracks'] }));

        expect(
            screen.getAllByPlaceholderText(messages['msg.buffer']!).map((input) => (input as HTMLInputElement).value)
        ).toEqual(['', '']);
        expect(getTrackCompositions(store.getState()).every((track) => track.buffer === undefined)).toBe(true);
        expect(getTrackCompositions(store.getState()).every((track) => track.rounding !== undefined)).toBe(true);
    });
});

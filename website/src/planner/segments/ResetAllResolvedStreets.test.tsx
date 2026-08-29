import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlanningStore } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import en from '../../lang/en.json';
import { ResetAllResolvedStreets } from './ResetAllResolvedStreets.tsx';

const resolveCalls: string[] = [];
const resolvePromises: (() => void)[] = [];

vi.mock('../logic/resolving/streets/resolveStreetNames.ts', () => ({
    resolveStreetNames: (segmentId: string) => async () => {
        resolveCalls.push(segmentId);
        await new Promise<void>((resolve) => resolvePromises.push(resolve));
    },
}));

describe('ResetAllResolvedStreets', () => {
    beforeEach(() => {
        resolveCalls.length = 0;
        resolvePromises.length = 0;
    });

    it('resolves segments sequentially and reports progress', async () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                { id: 'first', filename: 'first', points: [] },
                { id: 'second', filename: 'second', points: [] },
            ])
        );
        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={en}>
                    <ResetAllResolvedStreets />
                </IntlProvider>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Reset all streets' }));

        await waitFor(() => expect(resolveCalls).toEqual(['first']));
        expect(screen.getByText('Resolved: 0; waiting: 2 of 2 segments')).toBeInTheDocument();
        expect(resolvePromises).toHaveLength(1);

        resolvePromises[0]!();
        await waitFor(() => expect(resolveCalls).toEqual(['first', 'second']));
        expect(screen.getByText('Resolved: 1; waiting: 1 of 2 segments')).toBeInTheDocument();

        resolvePromises[1]!();
        await waitFor(() => expect(screen.queryByText('Resolved: 1; waiting: 1 of 2 segments')).toBeNull());
    });
});

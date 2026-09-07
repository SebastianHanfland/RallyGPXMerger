import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getMessages } from '../../../../../lang/getMessages.ts';
import { formatTimeOnly } from '../../../../../utils/dateUtil.ts';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import { trackMergeActions } from '../../../../store/trackMerge.reducer.ts';
import { PlannerSidebarOverviewEntryPoints } from '../PlannerSidebarOverviewEntryPoints.tsx';

const mockPositions = vi.hoisted(() => ({
    value: [] as {
        id: string;
        trackId: string;
        point: { lat: number; lon: number };
        at: string;
        passageAt: string;
        streetName: string;
        type: 'ENTRY';
    }[],
}));

vi.mock('../../../../logic/resolving/selectors/getEntryPointPositions.ts', () => ({
    getAllEntryPointPositions: vi.fn(() => mockPositions.value),
}));

describe('PlannerSidebarOverviewEntryPoints', () => {
    beforeEach(() => {
        mockPositions.value = [
            {
                id: 'entry-1',
                trackId: 'track-1',
                point: { lat: 48, lon: 11 },
                at: '2025-06-01T12:00:00.000Z',
                passageAt: '2025-06-01T12:07:00.000Z',
                streetName: 'First Street',
                type: 'ENTRY',
            },
            {
                id: 'entry-2',
                trackId: 'track-1',
                point: { lat: 48, lon: 11 },
                at: '2025-06-01T12:15:00.000Z',
                passageAt: '2025-06-01T12:22:00.000Z',
                streetName: 'Second Street',
                type: 'ENTRY',
            },
        ];
    });

    it('groups entry points into track tables and shows adjusted and real times', () => {
        const store = createPlanningStore();
        store.dispatch(
            trackMergeActions.setTracks([
                {
                    id: 'track-1',
                    name: 'Morning track',
                    color: '#123456',
                    segments: [
                        { id: 'entry-1', type: 'ENTRY', streetName: 'First Street' },
                        { id: 'entry-2', type: 'ENTRY', streetName: 'Second Street' },
                    ],
                },
                { id: 'track-2', name: 'Empty track', segments: [] },
            ])
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <PlannerSidebarOverviewEntryPoints />
                </IntlProvider>
            </Provider>
        );

        expect(screen.getByText(/Morning track/)).toBeInTheDocument();
        expect(screen.getByText(/2 entry points/)).toBeInTheDocument();
        expect(screen.queryByText(/Empty track/)).not.toBeInTheDocument();
        expect(screen.getAllByRole('table')).toHaveLength(1);
        expect(screen.getByText(formatTimeOnly(mockPositions.value[0].at, true))).toBeInTheDocument();
        expect(screen.getByText(formatTimeOnly(mockPositions.value[0].passageAt, true))).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Edit entry point description' })).toHaveLength(2);
        expect(screen.getAllByRole('button', { name: 'Remove entry point' })).toHaveLength(2);
    });
});

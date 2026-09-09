import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getMessages } from '../../../../../lang/getMessages.ts';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import { trackMergeActions } from '../../../../store/trackMerge.reducer.ts';
import type { TrackStreetInfo } from '../../../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../../../utils/dateUtil.ts';
import { PlannerSidebarOverviewTrackArrivals } from '../PlannerSidebarOverviewTrackArrivals.tsx';

const trackInfos = vi.hoisted(() => ({ value: [] as TrackStreetInfo[] }));

vi.mock('../../../../calculation/getTrackStreetInfos.ts', () => ({
    getTrackStreetInfos: vi.fn(() => trackInfos.value),
}));

const createTrackInfo = (id: string, arrivalFront: string): TrackStreetInfo => ({
    id,
    name: id,
    startFront: arrivalFront,
    arrivalFront,
    arrivalBack: arrivalFront,
    distanceInKm: 1,
    wayPoints: [],
});

describe('PlannerSidebarOverviewTrackArrivals', () => {
    beforeEach(() => {
        trackInfos.value = [
            createTrackInfo('late', '2025-06-01T12:10:00.000Z'),
            createTrackInfo('first', '2025-06-01T12:00:05.000Z'),
            createTrackInfo('second', '2025-06-01T12:00:45.000Z'),
            createTrackInfo('third', '2025-06-01T12:00:55.000Z'),
        ];
    });

    it('sorts and groups tracks by displayed front arrival time', () => {
        const store = createPlanningStore();
        store.dispatch(
            trackMergeActions.setTracks([
                { id: 'late', name: 'Late', color: '#111111', segments: [] },
                { id: 'first', name: 'First', color: '#222222', segments: [] },
                { id: 'second', name: 'Second', color: '#333333', segments: [] },
            ])
        );
        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <PlannerSidebarOverviewTrackArrivals />
                </IntlProvider>
            </Provider>
        );

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
        expect(rows[1]).toHaveTextContent('FirstSecond');
        expect(rows[1]).toHaveTextContent(formatTimeOnly(trackInfos.value[1]!.arrivalFront, true));
        expect(rows[2]).toHaveTextContent('Late');
        expect(rows[1]!.querySelectorAll('td')[1]!.children[1]).not.toHaveClass('d-block');
    });

    it('groups equal priorities on one line and separates different priorities', () => {
        const store = createPlanningStore();
        store.dispatch(
            trackMergeActions.setTracks([
                { id: 'late', name: 'Late', color: '#111111', segments: [], priority: 1 },
                { id: 'first', name: 'Low', color: '#222222', segments: [], priority: 2 },
                { id: 'second', name: 'High', color: '#333333', segments: [], priority: 5 },
                { id: 'third', name: 'Also high', color: '#444444', segments: [], priority: 5 },
            ])
        );
        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <PlannerSidebarOverviewTrackArrivals />
                </IntlProvider>
            </Provider>
        );

        const row = screen.getAllByRole('row')[1]!;
        expect(row.textContent).toContain('HighAlso high');
        expect(row.textContent).toContain('Low');
        const trackCell = row.querySelectorAll('td')[1]!;
        expect(trackCell.children).toHaveLength(2);
        expect(trackCell.children[0]).toHaveTextContent('HighAlso high');
        expect(trackCell.children[1]).toHaveTextContent('Low');
    });
});

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../../../store/planningStore.ts';
import { trackMergeActions } from '../../../store/trackMerge.reducer.ts';
import { getMessages } from '../../../../lang/getMessages.ts';
import { PlannerSidebarOverviewStartTimesHeader } from './PlannerSidebarOverviewStartTimesHeader.tsx';

const messages = getMessages('en');

function renderHeader(tracks: { id: string; buffer?: number; rounding?: number }[]) {
    const store = createPlanningStore();
    store.dispatch(trackMergeActions.setTracks(tracks.map((track) => ({ ...track, segments: [] }))));

    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <PlannerSidebarOverviewStartTimesHeader />
            </IntlProvider>
        </Provider>
    );
}

describe('PlannerSidebarOverviewStartTimesHeader', () => {
    it('shows a warning with the number of tracks without a buffer or rounding', () => {
        renderHeader([{ id: 'one' }, { id: 'two', buffer: 5 }, { id: 'three' }]);

        expect(screen.getByAltText('warning')).toBeInTheDocument();
        expect(screen.getByText(/2 tracks have neither buffer nor rounding set/)).toBeInTheDocument();
    });

    it('shows a check when every track has a buffer or rounding', () => {
        renderHeader([
            { id: 'one', buffer: 5 },
            { id: 'two', rounding: 10 },
        ]);

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.getByText(/All tracks have a buffer or rounding set/)).toBeInTheDocument();
    });

    it('treats zero as a configured value', () => {
        renderHeader([
            { id: 'one', buffer: 0 },
            { id: 'two', rounding: 0 },
        ]);

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.queryByAltText('warning')).toBeNull();
    });
});

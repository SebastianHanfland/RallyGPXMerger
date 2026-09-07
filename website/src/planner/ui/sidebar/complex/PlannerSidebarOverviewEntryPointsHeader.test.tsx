import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { getMessages } from '../../../../lang/getMessages.ts';
import { createPlanningStore } from '../../../store/planningStore.ts';
import { trackMergeActions } from '../../../store/trackMerge.reducer.ts';
import { ENTRY, TrackEntry } from '../../../store/types.ts';
import { PlannerSidebarOverviewEntryPointsHeader } from './PlannerSidebarOverviewEntryPointsHeader.tsx';

function renderHeader(entryPoints: TrackEntry[]) {
    const store = createPlanningStore();
    store.dispatch(trackMergeActions.setTracks([{ id: 'track', segments: entryPoints }]));

    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={getMessages('en')}>
                <PlannerSidebarOverviewEntryPointsHeader />
            </IntlProvider>
        </Provider>
    );
}

const createEntryPoint = (values: Partial<TrackEntry> = {}): TrackEntry => ({
    id: 'entry',
    type: ENTRY,
    streetName: 'Main Street',
    ...values,
});

describe('PlannerSidebarOverviewEntryPointsHeader', () => {
    it('shows a check when every entry point is configured', () => {
        renderHeader([createEntryPoint({ buffer: 0 }), createEntryPoint({ rounding: 0 })]);

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.getByText('All entry points have a street name and buffer or rounding set')).toBeInTheDocument();
    });

    it('counts each entry point once when street name and timing configuration are missing', () => {
        renderHeader([
            createEntryPoint({ streetName: '' }),
            createEntryPoint({ buffer: undefined, rounding: undefined }),
            createEntryPoint({ streetName: '', buffer: undefined, rounding: undefined }),
            createEntryPoint({ buffer: 5 }),
        ]);

        expect(screen.getByAltText('warning')).toBeInTheDocument();
        expect(screen.getByText('3 entry points lack a street name or buffer or rounding')).toBeInTheDocument();
    });

    it('shows a check when there are no entry points', () => {
        renderHeader([]);

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.queryByAltText('warning')).not.toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { getMessages } from '../../../../../lang/getMessages.ts';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import { trackMergeActions } from '../../../../store/trackMerge.reducer.ts';
import type { TrackStreetInfo } from '../../../../logic/resolving/types.ts';
import { SimplePlanningChecks } from '../SimplePlanningChecks.tsx';

const messages = getMessages('en');

const trackInfo = { id: 'track', name: 'Track', wayPoints: [] } as unknown as TrackStreetInfo;

function renderChecks() {
    const store = createPlanningStore();
    store.dispatch(trackMergeActions.setTracks([{ id: 'track', segments: [] }]));

    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <SimplePlanningChecks matchedTrackInfo={trackInfo} />
            </IntlProvider>
        </Provider>
    );
}

describe('SimplePlanningChecks', () => {
    it('shows checks when there are no gaps or unknown streets', () => {
        renderChecks();

        expect(screen.getAllByAltText('checkIcon')).toHaveLength(2);
        expect(screen.queryByAltText('warning')).not.toBeInTheDocument();
    });

    it('opens the gap overview and tolerance setting', async () => {
        renderChecks();

        await userEvent.click(screen.getByRole('button', { name: messages['msg.gaps'] }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(messages['msg.noGaps'])).toBeInTheDocument();
        expect(screen.getByTitle(messages['msg.gapTolerance.hint'])).toBeInTheDocument();
    });

    it('opens settings with API keys and street reset controls', async () => {
        renderChecks();

        await userEvent.click(screen.getByRole('button', { name: messages['msg.settings'] }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('geoapify API Key')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: messages['msg.resetAllStreets'] })).toBeInTheDocument();
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { getMessages } from '../../../../../lang/getMessages.ts';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import { trackMergeActions } from '../../../../store/trackMerge.reducer.ts';
import { pointsActions } from '../../../../store/points.reducer.ts';
import { PointOfInterestType } from '../../../../store/types.ts';
import { getPointToCenter, getShowPointsOfInterest } from '../../../../store/map.reducer.ts';
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

    return store;
}

describe('SimplePlanningChecks', () => {
    it('shows checks when there are no gaps, unknown streets, or open points', () => {
        renderChecks();

        expect(screen.getAllByAltText('checkIcon')).toHaveLength(3);
        expect(screen.queryByAltText('warning')).not.toBeInTheDocument();
    });

    it('shows point counts, opens the point list, and navigates after closing it', async () => {
        const store = renderChecks();
        const point = {
            id: 'todo',
            lat: 48,
            lng: 11,
            title: 'Todo point',
            description: 'Check this point',
            type: PointOfInterestType.TODO,
            radiusInM: 1,
        };
        store.dispatch(pointsActions.addPoint(point));

        const pointsButton = await waitFor(() => screen.getByRole('button', { name: /open todos/i }));
        expect(pointsButton).toHaveTextContent('1 open todos');
        expect(pointsButton).toHaveTextContent('1 Points');

        await userEvent.click(pointsButton);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(point.title)).toBeInTheDocument();

        await userEvent.click(screen.getByAltText('open on map'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(getShowPointsOfInterest(store.getState())).toBe(true);
        expect(getPointToCenter(store.getState())).toMatchObject({ lat: point.lat, lng: point.lng + 0.01 });
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

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language.ts';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner.tsx';
import { getMessages } from '../../src/lang/getMessages.ts';
import { createPlanningStore } from '../../src/planner/store/planningStore.ts';
import { getTrackCompositions, trackMergeActions } from '../../src/planner/store/trackMerge.reducer.ts';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks.ts';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux.ts';
import { plannerUi as ui } from './data/PlannerTestAccess.ts';

const messages = getMessages('en');

vi.mock('../../src/language.ts');
vi.mock('../../src/api/api.ts');
vi.mock('../../src/versions/cache/readableTracks.ts');
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate.ts', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));
vi.mock('../../src/planner/logic/resolving/streets/geoApifyMapMatching.ts', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

describe('Flow overview integration', () => {
    it('opens a time-scaled graph for tracks that merge', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        render(
            <MemoryRouter>
                <RallyPlannerWrapper store={store} />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        await user.click(ui.startButton());
        await user.click(ui.complexButton());
        await ui.uploadGpxSegment('segment1');
        await ui.uploadGpxSegment('segment2');
        await ui.uploadGpxSegment('segment3');

        await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(3), { timeout: 3000 });
        await user.click(ui.complexTracksTab(0));
        await user.click(ui.newTrackButton());

        await user.click(ui.segmentSelect());
        await user.click(screen.getByText('segment1'));
        await user.click(ui.segmentSelect());
        await user.click(screen.getByText('segment3'));

        const firstTrack = getTrackCompositions(store.getState())[0]!;
        store.dispatch(trackMergeActions.setTrackName({ id: firstTrack.id, trackName: 'Track 1' }));
        store.dispatch(trackMergeActions.setTrackPeopleCount({ id: firstTrack.id, peopleCount: 100 }));

        await user.click(ui.newTrackButton());
        await user.click(ui.segmentSelect());
        await user.click(screen.getByText('segment2'));
        await user.click(ui.segmentSelect());
        await user.click(screen.getByText('segment3'));

        const secondTrack = getTrackCompositions(store.getState())[1]!;
        store.dispatch(trackMergeActions.setTrackName({ id: secondTrack.id, trackName: 'Track 2' }));
        store.dispatch(trackMergeActions.setTrackPeopleCount({ id: secondTrack.id, peopleCount: 200 }));

        await waitFor(() => expect(getCalculateTracks(store.getState())).toHaveLength(2), { timeout: 3000 });
        await user.click(screen.getByRole('button', { name: messages['msg.overview'] }));

        const flowButton = screen.getByRole('button', { name: messages['msg.flowOverview'] });
        expect(flowButton).toBeInTheDocument();
        await user.click(flowButton);

        const dialog = screen.getByRole('dialog');
        expect(within(dialog).getByText(messages['msg.flowOverview.title'])).toBeInTheDocument();
        expect(within(dialog).getByTestId('flow-overview-graph')).toBeInTheDocument();
        expect(within(dialog).getAllByTestId('flow-overview-node')).toHaveLength(1);
        expect(within(dialog).getByTestId('flow-overview-finish')).toBeInTheDocument();
        const legend = within(dialog).getByTestId('flow-overview-legend');
        expect(legend).toHaveTextContent('Track 1');
        expect(legend).toHaveTextContent('Track 2');

        const closeButtons = within(dialog).getAllByRole('button', { name: messages['msg.close'] });
        await user.click(closeButtons[closeButtons.length - 1]!);
        expect(screen.queryByTestId('flow-overview-graph')).toBeNull();
    });
});

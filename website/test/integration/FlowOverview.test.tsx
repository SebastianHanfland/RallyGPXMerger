import { waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { getTrackCompositions, trackMergeActions } from '../../src/planner/store/trackMerge.reducer';
import { flowOverviewUi } from './accessObjects/FlowOverviewTestAccess.ts';
import { plannerUi } from './accessObjects/PlannerTestAccess.ts';
import { createTrack, prepareComplexPlanning, renderPlanner } from './data/PlannerTestSetup.tsx';

const timeout = { timeout: 3000 };

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));
vi.mock('../../src/planner/logic/resolving/streets/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

async function prepareMergedTracks() {
    const context = renderPlanner();
    await prepareComplexPlanning(context.user, context.store);
    const firstTrack = await createTrack(context.user, context.store, ['segment1', 'segment3']);
    const secondTrack = await createTrack(context.user, context.store, ['segment2', 'segment3']);
    context.store.dispatch(trackMergeActions.setTrackName({ id: firstTrack.id, trackName: 'Track 1' }));
    context.store.dispatch(trackMergeActions.setTrackPeopleCount({ id: firstTrack.id, peopleCount: 100 }));
    context.store.dispatch(trackMergeActions.setTrackName({ id: secondTrack.id, trackName: 'Track 2' }));
    context.store.dispatch(trackMergeActions.setTrackPeopleCount({ id: secondTrack.id, peopleCount: 200 }));
    await waitFor(() => expect(getCalculateTracks(context.store.getState())).toHaveLength(2), timeout);
    await context.user.click(plannerUi.overviewButton());
    return context;
}

describe('flow overview integration', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    it('renders a time-scaled graph for tracks that merge', async () => {
        const { store, user } = await prepareMergedTracks();

        expect(flowOverviewUi.openButton()).toBeInTheDocument();
        await user.click(flowOverviewUi.openButton());

        expect(flowOverviewUi.title()).toBeInTheDocument();
        expect(flowOverviewUi.graph()).toBeInTheDocument();
        expect(flowOverviewUi.node()).toHaveLength(1);
        expect(flowOverviewUi.finish()).toBeInTheDocument();
        expect(flowOverviewUi.legend()).toHaveTextContent('Track 1');
        expect(flowOverviewUi.legend()).toHaveTextContent('Track 2');
        expect(getTrackCompositions(store.getState())).toHaveLength(2);
    });

    it('closes the flow overview dialog', async () => {
        const { user } = await prepareMergedTracks();
        await user.click(flowOverviewUi.openButton());
        await user.click(flowOverviewUi.closeButton());

        expect(() => flowOverviewUi.graph()).toThrow();
    });
});

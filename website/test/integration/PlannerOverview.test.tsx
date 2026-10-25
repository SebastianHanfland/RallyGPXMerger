import { screen, waitFor, within } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import { backendActions } from '../../src/planner/store/backend.reducer';
import { getTrackCompositions, trackMergeActions } from '../../src/planner/store/trackMerge.reducer';
import { getPointToCenter } from '../../src/planner/store/map.reducer';
import { plannerUi } from './accessObjects/PlannerTestAccess';
import { createTrack, prepareComplexPlanning, renderPlanner } from './data/PlannerTestSetup';

const messages = getMessages('en');

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

describe('planner overview', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    it('shows the overview sections for complex planning', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        await user.click(plannerUi.overviewButton());

        const priorityItem = plannerUi.overviewAccordion(messages['msg.prio']);
        await user.click(within(priorityItem.querySelector('.accordion-header')!).getByRole('button'));
        expect(within(priorityItem).getByRole('columnheader', { name: messages['msg.priority'] })).toBeInTheDocument();
        expect(
            within(priorityItem).getByRole('columnheader', { name: messages['msg.trackPeople'] })
        ).toBeInTheDocument();

        const nodesItem = plannerUi.overviewAccordion(messages['msg.nodes']);
        await user.click(within(nodesItem.querySelector('.accordion-header')!).getByRole('button'));
        expect(within(nodesItem).getByRole('columnheader', { name: messages['msg.branches'] })).toBeInTheDocument();
        expect(store.getState()).toBeDefined();
    });

    it('creates public links after the planning is saved', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store, []);
        await user.click(plannerUi.overviewButton());

        const publicLinksItem = plannerUi.overviewAccordion(messages['msg.publicLinks']);
        await user.click(within(publicLinksItem.querySelector('.accordion-header')!).getByRole('button'));
        expect(within(publicLinksItem).getByText(messages['msg.publicLinks.unsaved'])).toBeInTheDocument();

        store.dispatch(backendActions.setPlanningId('test-planning'));
        store.dispatch(backendActions.setIsPlanningSaved(true));
        await waitFor(() =>
            expect(within(publicLinksItem).getByRole('link', { name: messages['msg.publicLink'] })).toHaveAttribute(
                'href',
                expect.stringContaining('?display=test-planning')
            )
        );
    });

    it('shows start names and centers the map from the start-name overview', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        const firstTrack = await createTrack(user, store, ['segment1', 'segment3']);
        const secondTrack = await createTrack(user, store, ['segment2', 'segment3']);
        store.dispatch(trackMergeActions.setTrackName({ id: firstTrack.id, trackName: 'Track 1' }));
        store.dispatch(trackMergeActions.setTrackName({ id: secondTrack.id, trackName: 'Track 2' }));

        await user.click(plannerUi.overviewButton());
        const startNamesItem = plannerUi.overviewAccordion(/Start name overwrite/);
        await user.click(within(startNamesItem.querySelector('.accordion-header')!).getByRole('button'));

        const table = within(startNamesItem).getByRole('table');
        expect(
            within(table)
                .getAllByRole('columnheader')
                .map((header) => header.textContent)
        ).toEqual([messages['msg.trackName'], messages['msg.publicStart'], messages['msg.startName']]);
        expect(within(table).getAllByRole('textbox')).toHaveLength(2);

        const startPoint = getTrackCompositions(store.getState())[0]!;
        let centeredPoint: ReturnType<typeof getPointToCenter>;
        const unsubscribe = store.subscribe(() => {
            const point = getPointToCenter(store.getState());
            if (point) centeredPoint = point;
        });
        await user.click(within(table).getAllByRole('button', { name: messages['msg.goToStart'] })[0]!);
        unsubscribe();
        expect(centeredPoint).toBeDefined();
        expect(startPoint.name).toBe('Track 1');

        store.dispatch(trackMergeActions.setTrackStartName({ id: startPoint.id, startName: 'Published start' }));
        await waitFor(() => expect(within(table).getByText('Published start')).toBeInTheDocument());
        expect(within(table).getByText('Published start')).toHaveStyle({ fontWeight: 'bold' });

        await user.click(plannerUi.downloadsButton());
        expect(plannerUi.pdfDownloadButton()).toBeInTheDocument();
    });
});

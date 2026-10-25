import { screen, waitFor, within } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import { getTrackStreetInfos } from '../../src/planner/calculation/getTrackStreetInfos';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getHighlightedStreetPath, getStreetPointSelection, mapActions } from '../../src/planner/store/map.reducer';
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

describe('planner streets', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    async function prepareStreetList() {
        const context = renderPlanner();
        await prepareComplexPlanning(context.user, context.store);
        await createTrack(context.user, context.store, ['segment1', 'segment3']);
        await context.user.click(plannerUi.streetsTab());
        return context;
    }

    it('starts and cancels adding a street', async () => {
        const { user } = await prepareStreetList();
        const insertionButtons = within(plannerUi.streetInsertionRail()).getAllByRole('button');
        expect(insertionButtons.length).toBeGreaterThan(1);
        expect(insertionButtons[0]).toHaveTextContent('+');

        await user.click(insertionButtons[0]!);
        expect(plannerUi.activeAddStreetButton()).toBeInTheDocument();
        expect(plannerUi.streetColumnHeaders().map((header) => header.textContent)).toEqual([
            messages['msg.start'],
            messages['msg.end'],
            messages['msg.street'],
            messages['msg.postCode'],
            messages['msg.district'],
            messages['msg.length'],
            messages['msg.streetPoints'],
        ]);
    });

    it('highlights a street and opens boundary selection', async () => {
        const { store, user } = await prepareStreetList();
        const firstStreetRow = plannerUi.streetRow(1);

        await user.click(plannerUi.streetAction(firstStreetRow, 0));
        expect(getHighlightedStreetPath(store.getState())).toBeDefined();
        expect(getHighlightedStreetPath(store.getState())!.length).toBeGreaterThan(0);

        await user.click(plannerUi.streetAction(firstStreetRow, 1));
        expect(getStreetPointSelection(store.getState())?.boundary).toBe('start');
        await user.click(plannerUi.streetAction(firstStreetRow, 1));
        expect(getStreetPointSelection(store.getState())).toBeUndefined();
    });

    it('edits a street name and selects the opposite boundary', async () => {
        const { store, user } = await prepareStreetList();
        const firstStreetRow = plannerUi.streetRow(1);
        await user.click(plannerUi.streetAction(firstStreetRow, 1));
        store.dispatch(
            mapActions.setSelectedStreetPoint({
                segmentId: getParsedGpxSegments(store.getState())[0]!.id,
                pointIndex: 0,
            })
        );

        await user.click(within(firstStreetRow.cells[2]!).getByAltText('upload file'));
        const dialog = plannerUi.dialog();
        const input = within(dialog).getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Edited street');
        await user.click(within(dialog).getByRole('button', { name: messages['msg.confirm'] }));
        await waitFor(() =>
            expect(getTrackStreetInfos(store.getState())[0]!.wayPoints[0]!.streetName).toBe('Edited street')
        );

        await user.click(plannerUi.streetAction(plannerUi.streetRow(1), 3));
        expect(getStreetPointSelection(store.getState())?.boundary).toBe('end');
    });
});

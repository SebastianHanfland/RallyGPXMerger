import { fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { getSelectedTrackId } from '../../src/planner/store/layout.reducer';
import {
    getSegmentIdClipboard,
    getTrackCompositions,
    trackMergeActions,
} from '../../src/planner/store/trackMerge.reducer';
import { plannerUi } from './accessObjects/PlannerTestAccess.ts';
import { createTrack, prepareComplexPlanning, renderPlanner } from './data/PlannerTestSetup.tsx';

const messages = getMessages('en');
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

describe('planner tracks', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    async function createTwoEmptyTracks() {
        const context = renderPlanner();
        await userStartComplex(context.user);
        await context.user.click(plannerUi.complexTracksTab(0));
        await context.user.click(plannerUi.newTrackButton());
        await context.user.click(plannerUi.newTrackButton());
        return context;
    }

    async function userStartComplex(user: ReturnType<typeof userEvent.setup>) {
        await user.click(plannerUi.startButton());
        await user.click(plannerUi.complexButton());
    }

    it('opens track actions without changing the selected track', async () => {
        const { store } = await createTwoEmptyTracks();
        const [firstTrack, secondTrack] = getTrackCompositions(store.getState());
        store.dispatch(trackMergeActions.setTrackName({ id: firstTrack!.id, trackName: 'First track' }));
        store.dispatch(trackMergeActions.setTrackName({ id: secondTrack!.id, trackName: 'Second track' }));

        fireEvent.contextMenu(plannerUi.trackTab(firstTrack!.id));
        const menu = plannerUi.trackContextMenu();
        expect(within(menu).getByText(messages['msg.removeTrack'])).toBeInTheDocument();
        expect(within(menu).getByText(messages['msg.copySegments'])).toBeInTheDocument();
        expect(getSelectedTrackId(store.getState())).toBe(secondTrack!.id);
    });

    it('changes a track color from its context menu', async () => {
        const { store, user } = await createTwoEmptyTracks();
        const firstTrack = getTrackCompositions(store.getState())[0]!;

        fireEvent.contextMenu(plannerUi.trackTab(firstTrack.id));
        await user.click(within(plannerUi.trackContextMenu()).getByText(messages['msg.setColor']));
        const colorDialog = plannerUi.dialog();
        const colorInput = within(colorDialog).getByRole('textbox');
        await user.clear(colorInput);
        await user.type(colorInput, '123456');
        await user.click(within(colorDialog).getByRole('button', { name: messages['msg.confirm'] }));

        expect(getTrackCompositions(store.getState()).find((track) => track.id === firstTrack.id)?.color).toBe(
            '#123456'
        );
    });

    it('copies a track segment selection from its context menu', async () => {
        const { store, user } = await createTwoEmptyTracks();
        const firstTrack = getTrackCompositions(store.getState())[0]!;

        fireEvent.contextMenu(plannerUi.trackTab(firstTrack.id));
        await user.click(within(plannerUi.trackContextMenu()).getByText(messages['msg.copySegments']));

        expect(getSegmentIdClipboard(store.getState())).toEqual(firstTrack.segments);
    });

    it('calculates a track after segments are selected', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        const track = await createTrack(user, store, ['segment1', 'segment3']);

        expect(track.segments).toHaveLength(2);
        await waitFor(() => expect(getCalculateTracks(store.getState())).toHaveLength(1), timeout);
    });

    it('opens the track description dialog', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store, ['segment1']);
        await createTrack(user, store, ['segment1']);

        await user.click(plannerUi.trackDescriptionButton());
        expect(plannerUi.dialog()).toBeInTheDocument();
        await user.click(plannerUi.closeDialog());
        expect(() => plannerUi.dialog()).toThrow();
    });

    it('updates track buffer and rounding in the track info tab', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        await createTrack(user, store, ['segment1', 'segment3']);
        await user.click(plannerUi.infoTab());

        const buffer = plannerUi.bufferInput();
        const rounding = plannerUi.roundingInput();
        await user.type(buffer, '5');
        await user.type(rounding, '10');

        await waitFor(() =>
            expect(getTrackCompositions(store.getState())[0]).toMatchObject({ buffer: 5, rounding: 10 })
        );
    });
});

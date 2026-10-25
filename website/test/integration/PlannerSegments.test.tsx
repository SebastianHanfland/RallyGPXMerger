import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getTrackCompositions, trackMergeActions } from '../../src/planner/store/trackMerge.reducer';
import { SEGMENT } from '../../src/planner/store/types';
import { plannerUi } from './accessObjects/PlannerTestAccess';
import { createTrack, prepareComplexPlanning, renderPlanner } from './data/PlannerTestSetup';

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

function segmentNames() {
    return within(plannerUi.segmentTable())
        .getAllByRole('row')
        .filter((row) => within(row).queryAllByRole('textbox').length > 0)
        .map((row) => (within(row).getAllByRole('textbox')[0] as HTMLInputElement).value);
}

describe('planner segments', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    it('adds and removes a break around a track segment', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store, ['segment1', 'segment2']);
        const track = await createTrack(user, store, ['segment1', 'segment2']);
        const segmentId = track.segments[0]!.id;

        fireEvent.contextMenu(plannerUi.trackSegment(segmentId));
        await user.click(plannerUi.segmentContextMenuItem(messages['msg.addBreakBefore']));
        const breakDialog = plannerUi.dialog();
        await user.clear(within(breakDialog).getByTitle(messages['msg.minutes.details']));
        await user.type(within(breakDialog).getByTitle(messages['msg.minutes.details']), '10');
        await user.click(plannerUi.addDialog());

        await waitFor(() => expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(3));
        expect(getTrackCompositions(store.getState())[0]!.segments.map((element) => element.type)).toEqual([
            'BREAK',
            'SEGMENT',
            'SEGMENT',
        ]);

        const breakId = getTrackCompositions(store.getState())[0]!.segments[0]!.id;
        fireEvent.contextMenu(plannerUi.trackBreak(breakId));
        await user.click(plannerUi.segmentContextMenuItem(messages['msg.removeBreakSegment']));
        await user.click(plannerUi.confirmDialog());
        expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(2);
    });

    it('adds and removes an entry point around a track segment', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store, ['segment1', 'segment2']);
        const track = await createTrack(user, store, ['segment1', 'segment2']);
        const segmentId = track.segments[0]!.id;

        fireEvent.contextMenu(plannerUi.trackSegment(segmentId));
        await user.click(plannerUi.segmentContextMenuItem(messages['msg.addEntryPointAfter']));
        const entryDialog = plannerUi.dialog();
        await user.type(within(entryDialog).getByPlaceholderText(messages['msg.street']), 'Start Street');
        await user.click(plannerUi.addDialog());

        await waitFor(() => expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(3));
        const entryId = getTrackCompositions(store.getState())[0]!.segments[1]!.id;
        expect(getTrackCompositions(store.getState())[0]!.segments.map((element) => element.type)).toEqual([
            'SEGMENT',
            'ENTRY',
            'SEGMENT',
        ]);

        fireEvent.contextMenu(plannerUi.trackEntryPoint(entryId));
        await user.click(plannerUi.segmentContextMenuItem(messages['msg.removeEntryPoint']));
        await user.click(plannerUi.confirmDialog());
        expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(2);
    });

    it('sorts segments by name and distance', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);

        const initialNames = segmentNames();
        const distances = within(plannerUi.segmentTable())
            .getAllByRole('row')
            .filter((row) => within(row).queryAllByRole('textbox').length > 0)
            .map((row) => Number(within(row).getAllByRole('cell')[1]?.textContent?.replace(' km', '')));
        expect(distances.every((distance) => distance > 0)).toBe(true);

        await user.click(plannerUi.segmentSortButton(messages['msg.file']));
        expect(segmentNames()).toEqual([...initialNames].sort((a, b) => b.localeCompare(a)));
        await user.click(plannerUi.segmentSortButton(messages['msg.file']));
        expect(segmentNames()).toEqual([...initialNames].sort((a, b) => a.localeCompare(b)));
        await user.click(plannerUi.segmentSortButton(messages['msg.distanceInKm']));
        expect(
            within(plannerUi.segmentTable())
                .getAllByRole('row')
                .filter((row) => within(row).queryAllByRole('textbox').length > 0)
                .map((row) => Number(within(row).getAllByRole('cell')[1]?.textContent?.replace(' km', '')))
        ).toEqual([...distances].sort((a, b) => a - b));
    });

    it('shows calculated speeds for uploaded segments', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);

        await user.click(plannerUi.complexSegmentsTab());
        expect(plannerUi.segmentTable()).toBeInTheDocument();
        expect(plannerUi.textMatching(/km\/h/)).toHaveLength(3);
    });

    it('opens and closes the segment color editor from the context menu', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store, ['segment1', 'segment2']);
        const track = await createTrack(user, store, ['segment1', 'segment2']);

        fireEvent.contextMenu(plannerUi.trackSegment(track.segments[0]!.id));
        await user.click(plannerUi.segmentContextMenuItem(messages['msg.setColor']));
        expect(plannerUi.dialog()).toBeInTheDocument();
        await user.click(plannerUi.closeDialog());
        expect(() => plannerUi.dialog()).toThrow();
    });

    it('filters segments by whether they are used by a track', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        const firstSegment = getParsedGpxSegments(store.getState())[0]!;
        const track =
            getTrackCompositions(store.getState())[0] ??
            (store.dispatch(trackMergeActions.addTrackComposition()), getTrackCompositions(store.getState())[0]!);
        store.dispatch(
            trackMergeActions.setSegments({
                id: track.id,
                segments: [{ id: firstSegment.id, segmentId: firstSegment.id, type: SEGMENT }],
            })
        );

        await user.click(plannerUi.usedSegmentsButton());
        expect(segmentNames()).not.toContain(firstSegment.filename);
        await user.click(plannerUi.unusedSegmentsButton());
        expect(segmentNames()).toHaveLength(3);
        await user.click(plannerUi.unusedSegmentsButton());
        expect(segmentNames()).toEqual([firstSegment.filename]);
    });

    it('splits an uploaded segment into two segments', async () => {
        const { store, user } = renderPlanner();
        await prepareComplexPlanning(user, store);
        const firstSegment = getParsedGpxSegments(store.getState())[0]!;

        await plannerUi.splitSegment(firstSegment.id, store.dispatch);
        await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(4), timeout);

        const splitSegments = getParsedGpxSegments(store.getState()).filter((segment) =>
            segment.filename.startsWith(`${firstSegment.filename}-`)
        );
        expect(splitSegments).toHaveLength(2);
        expect(splitSegments.map((segment) => segment.points[0]?.t)).toEqual([0, 0]);
    });
});

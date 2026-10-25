import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { RallyPlannerWrapper } from '../../../src/planner/RallyPlanner';
import { createPlanningStore } from '../../../src/planner/store/planningStore';
import { getParsedGpxSegments } from '../../../src/planner/store/segmentData.redux';
import { getTrackCompositions } from '../../../src/planner/store/trackMerge.reducer';
import { plannerUi } from './PlannerTestAccess';

const timeout = { timeout: 3000 };

export function renderPlanner() {
    const store = createPlanningStore();
    render(
        <MemoryRouter>
            <RallyPlannerWrapper store={store} />
        </MemoryRouter>
    );
    return { store, user: userEvent.setup() };
}

export async function startSimplePlanning(user: ReturnType<typeof userEvent.setup>) {
    await user.click(plannerUi.startButton());
    await user.click(plannerUi.simpleButton());
}

export async function startComplexPlanning(user: ReturnType<typeof userEvent.setup>) {
    await user.click(plannerUi.startButton());
    await user.click(plannerUi.complexButton());
}

export async function uploadSegments(
    store: ReturnType<typeof createPlanningStore>,
    names: Array<'segment1' | 'segment2' | 'segment3'>
) {
    for (const name of names) {
        await plannerUi.uploadGpxSegment(name);
    }
    await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(names.length), timeout);
}

export async function createTrack(
    user: ReturnType<typeof userEvent.setup>,
    store: ReturnType<typeof createPlanningStore>,
    segmentNames: Array<'segment1' | 'segment2' | 'segment3'>
) {
    await user.click(plannerUi.complexTracksTab(getTrackCompositions(store.getState()).length));
    await user.click(plannerUi.newTrackButton());
    for (const segmentName of segmentNames) {
        await user.click(plannerUi.segmentSelect());
        await user.click(plannerUi.segmentOption(segmentName));
    }
    const tracks = getTrackCompositions(store.getState());
    return tracks[tracks.length - 1]!;
}

export async function prepareComplexPlanning(
    user: ReturnType<typeof userEvent.setup>,
    store: ReturnType<typeof createPlanningStore>,
    names: Array<'segment1' | 'segment2' | 'segment3'> = ['segment1', 'segment2', 'segment3']
) {
    await startComplexPlanning(user);
    await uploadSegments(store, names);
}

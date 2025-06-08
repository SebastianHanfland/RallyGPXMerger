import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getCalculatedTracks } from '../../src/planner/store/calculatedTracks.reducer';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
import { plannerUi as ui } from './data/PlannerTestAccess';
import { getParsedGpxSegments } from '../../src/planner/new-store/segmentData.redux';
import { geoApifyFetchMapMatching } from '../../src/planner/logic/resolving/street-new/geoApifyMapMatching';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/streets/mapMatchingStreetResolver');
vi.mock('../../src/planner/logic/resolving/postcode/postCodeResolver', () => ({
    addPostCodeToStreetInfos: () => Promise.resolve(),
}));
vi.mock('../../src/planner/logic/resolving/street-new/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));

describe('Planner integration test', () => {
    describe('Main navigation', () => {
        it('Starts a new simple planning', async () => {
            (getLanguage as Mock).mockImplementation(() => 'en');
            const store = createPlanningStore();
            render(<RallyPlannerWrapper store={store} />, { wrapper: MemoryRouter });

            const user = userEvent.setup();

            ui.header();
            ui.startButton();
            ui.openButton();
            ui.continueButton(false);

            await user.click(ui.startButton());

            ui.simpleButton();
            ui.complexButton();

            await user.click(ui.simpleButton());
            ui.segmentHeading();
            ui.simpleSegmentTab();
            ui.simpleSettingsTab();
        });

        it('Starts a new complex planning', async () => {
            (getLanguage as Mock).mockImplementation(() => 'en');
            const store = createPlanningStore();
            render(<RallyPlannerWrapper store={store} />, { wrapper: MemoryRouter });

            const user = userEvent.setup();

            ui.header();
            ui.startButton();
            ui.openButton();
            ui.continueButton(false);

            await user.click(ui.startButton());

            ui.simpleButton();
            ui.complexButton();

            await user.click(ui.complexButton());
            ui.complexSegmentsTab();
            ui.complexTracksTab(0);
        });
    });

    describe('Simple planning', () => {
        it('Create a simple planning with two elements', async () => {
            (getLanguage as Mock).mockImplementation(() => 'en');
            const store = createPlanningStore();
            render(<RallyPlannerWrapper store={store} />, { wrapper: MemoryRouter });

            const user = userEvent.setup();

            await user.click(ui.startButton());
            await user.click(ui.simpleButton());
            await ui.uploadGpxSegment('segment1');
            await ui.uploadGpxSegment('segment2');

            expect(getParsedGpxSegments(store.getState())).toHaveLength(2);
            expect(getCalculatedTracks(store.getState())).toHaveLength(1);

            ui.pdfDownloadButton();
        });
    });

    describe('Complex planning', () => {
        it('Create a complex planning with two tracks', async () => {
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

            expect(getParsedGpxSegments(store.getState())).toHaveLength(3);
            expect(getCalculatedTracks(store.getState())).toHaveLength(0);

            await user.click(ui.complexTracksTab(0));
            await user.click(ui.newTrackButton());
            expect(getTrackCompositions(store.getState())).toHaveLength(1);

            await user.clear(ui.trackNameInput());
            await user.type(ui.trackNameInput(), 'Track 1');

            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment1'));
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment3'));
            expect(getTrackCompositions(store.getState())[0].segmentIds).toHaveLength(2);

            await user.click(ui.newTrackButton());
            expect(getTrackCompositions(store.getState())).toHaveLength(2);

            await user.clear(ui.trackNameInput());
            await user.type(ui.trackNameInput(), 'Track 2');

            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment2'));
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment3'));
            expect(getTrackCompositions(store.getState())[1].segmentIds).toHaveLength(2);

            await user.click(screen.getByText(/Calculate/));
            await waitFor(() => expect(getCalculatedTracks(store.getState())).toHaveLength(2));
            ui.pdfDownloadButton();
        });

        it('splitting a segment into two', async () => {
            (getLanguage as Mock).mockImplementation(() => 'en');
            const store = createPlanningStore();
            render(<RallyPlannerWrapper store={store} />, { wrapper: MemoryRouter });

            const user = userEvent.setup();

            await user.click(ui.startButton());
            await user.click(ui.complexButton());
            await ui.uploadGpxSegment('segment1');
            const listWithFirstSegment = getParsedGpxSegments(store.getState());
            expect(listWithFirstSegment).toHaveLength(1);
            const firstSegment = listWithFirstSegment[0];
            await ui.uploadGpxSegment('segment2');
            await ui.uploadGpxSegment('segment3');
            expect(getParsedGpxSegments(store.getState())).toHaveLength(3);

            await ui.splitSegment(firstSegment.id, store.dispatch);
            expect(getParsedGpxSegments(store.getState())).toHaveLength(4);
        });
    });
});

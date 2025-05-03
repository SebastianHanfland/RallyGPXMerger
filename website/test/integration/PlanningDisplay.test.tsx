import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { AppDispatch, createPlanningStore } from '../../src/planner/store/planningStore';
import { getGpxSegments, gpxSegmentsActions } from '../../src/planner/store/gpxSegments.reducer';
import * as fs from 'node:fs';
import { splitGpxAtPosition } from '../../src/planner/segments/splitSegmentThunk';
import { getCalculatedTracks } from '../../src/planner/store/calculatedTracks.reducer';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/streets/mapMatchingStreetResolver');
vi.mock('../../src/planner/logic/resolving/postcode/postCodeResolver', () => ({
    addPostCodeToStreetInfos: () => Promise.resolve(),
}));

const ui = {
    startButton: () => screen.getByRole('button', { name: RegExp(messages['msg.startPlan']) }),
    continueButton: (exists: boolean = true) =>
        exists
            ? screen.getByRole('button', { name: RegExp(messages['msg.continuePlan']) })
            : expect(screen.queryByRole('button', { name: RegExp(messages['msg.continuePlan']) })).toBeNull(),
    openButton: () => screen.getByRole('button', { name: RegExp(messages['msg.loadPlan']) }),
    header: () => screen.getByRole('heading', { name: 'Rally GPX Merger' }),

    simpleButton: () => screen.getByRole('button', { name: RegExp(messages['msg.simple']) }),
    complexButton: () => screen.getByRole('button', { name: RegExp(messages['msg.complex']) }),

    segmentHeading: () => screen.getByRole('heading', { name: messages['msg.segments'] }),
    simpleSegmentTab: () => screen.getByRole('button', { name: messages['msg.simpleTrack'] }),
    simpleSettingsTab: () =>
        screen.getByRole('button', { name: `${messages['msg.settings']}/${messages['msg.documents']}` }),
    complexSegmentsTab: () => screen.getByRole('button', { name: messages['msg.segments'] }),
    complexTracksTab: (amount: number) =>
        screen.getByRole('button', { name: messages['msg.tracks'] + '(' + amount + ')' }),
    uploadGpxSegment: async (fileName: string) => {
        const fileInput = screen.queryByText(/upload the/) ?? screen.queryByText(/Successfully/);
        const inputElement = fileInput.parentNode.parentNode;
        const buffer = fs.readFileSync(`./test/integration/data/${fileName}.gpx`);
        const file = new File([buffer], `${fileName}.gpx`, { type: 'application/gpx+xml' });
        file.arrayBuffer = () => Promise.resolve(buffer.buffer);
        await act(() => fireEvent.drop(inputElement, { dataTransfer: { files: [file] } }));
    },
    splitSegment: async (segmentId: string, dispatch: AppDispatch) => {
        const actionPayload = { segmentId, lat: 48.128275, lng: 11.630246 };
        await act(() => dispatch(gpxSegmentsActions.setClickOnSegment(actionPayload)));
        await act(() => dispatch(splitGpxAtPosition));
    },
    pdfDownloadButton: () => screen.getByRole('button', { name: /PDF/ }),
    newTrackButton: () => screen.getByText(messages['msg.addNewTrack'], { exact: false }),
    trackNameInput: () => screen.getByPlaceholderText('Track name'),
    segmentSelect: () => screen.getByRole('combobox'),
};

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

            expect(getGpxSegments(store.getState())).toHaveLength(2);
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

            expect(getGpxSegments(store.getState())).toHaveLength(3);
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
            const listWithFirstSegment = getGpxSegments(store.getState());
            expect(listWithFirstSegment).toHaveLength(1);
            const firstSegment = listWithFirstSegment[0];
            await ui.uploadGpxSegment('segment2');
            await ui.uploadGpxSegment('segment3');
            expect(getGpxSegments(store.getState())).toHaveLength(3);

            await ui.splitSegment(firstSegment.id, store.dispatch);
            expect(getGpxSegments(store.getState())).toHaveLength(4);
        });
    });
});

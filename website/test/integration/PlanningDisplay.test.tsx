import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
import { trackMergeActions } from '../../src/planner/store/trackMerge.reducer';
import { SEGMENT } from '../../src/planner/store/types';
import { plannerUi as ui } from './data/PlannerTestAccess';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { getGapToleranceInKm } from '../../src/planner/store/settings.reducer';
import { getHighlightedStreetPath, getStreetPointSelection, mapActions } from '../../src/planner/store/map.reducer';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));
vi.mock('../../src/planner/logic/resolving/street-new/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

const timeout = { timeout: 3000 };
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
            expect(screen.getByTitle(messages['msg.cloudActions'])).toHaveStyle({ width: '45px', height: '45px' });
            expect(screen.getByTitle(messages['msg.downloads'])).toHaveStyle({ width: '45px', height: '45px' });
            await user.click(ui.simpleSettingsTab());
            expect(screen.queryByText(messages['msg.serverData'])).toBeNull();
            expect(screen.queryByText(messages['msg.localData'])).toBeNull();
            const gapToleranceInput = screen.getByTitle(messages['msg.gapTolerance.hint']);
            expect(gapToleranceInput).toHaveValue(10);
            fireEvent.change(gapToleranceInput, { target: { value: '25' } });
            expect(getGapToleranceInKm(store.getState())).toBe(0.025);
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

            expect(screen.getByText(messages['msg.description.segments'], { exact: false })).toBeInTheDocument();

            expect(screen.getByRole('button', { name: messages['msg.overview'] })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: messages['msg.documents'] })).toBeNull();
            await user.click(screen.getByRole('button', { name: messages['msg.overview'] }));
            expect(screen.getByText(messages['msg.checks'])).toBeInTheDocument();
            const pointsAccordion = screen.getByRole('button', { name: messages['msg.points'] });
            expect(pointsAccordion).toBeInTheDocument();
            await user.click(pointsAccordion);
            const gapToleranceInputs = screen.getAllByTitle(messages['msg.gapTolerance.hint']);
            expect(gapToleranceInputs).toHaveLength(2);
            const pointsOfInterest = screen.getByText(messages['msg.pointsOfInterest']);
            expect(pointsOfInterest).toBeInTheDocument();
            expect(gapToleranceInputs[1]!.compareDocumentPosition(pointsOfInterest)).toBe(
                Node.DOCUMENT_POSITION_FOLLOWING
            );
            expect(screen.getByTitle(messages['msg.cloudActions'])).toHaveStyle({ width: '45px', height: '45px' });
            expect(screen.getByTitle(messages['msg.downloads'])).toHaveStyle({ width: '45px', height: '45px' });
            expect(
                screen
                    .getByTitle(messages['msg.cloudActions'])
                    .compareDocumentPosition(screen.getByTitle(messages['msg.downloads']))
            ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
            await user.click(screen.getByRole('button', { name: messages['msg.cloudActions'] }));
            expect(screen.getByText(messages['msg.cloudSaving'])).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: messages['msg.cloudActions'] }));
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

            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(2), timeout);
            expect(getCalculateTracks(store.getState())).toHaveLength(1);

            await user.click(screen.getByTitle(messages['msg.downloads']));
            await waitFor(() => ui.pdfDownloadButton(), timeout);
        });
    });

    describe('Complex planning', () => {
        it('shows segment distances and supports sorting and usage filtering', async () => {
            (getLanguage as Mock).mockImplementation(() => 'en');
            const store = createPlanningStore();
            render(<RallyPlannerWrapper store={store} />, { wrapper: MemoryRouter });

            const user = userEvent.setup();

            await user.click(ui.startButton());
            await user.click(ui.complexButton());
            await ui.uploadGpxSegment('segment1');
            await ui.uploadGpxSegment('segment2');
            await ui.uploadGpxSegment('segment3');
            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(3), timeout);

            const table = screen.getByRole('table');
            const getRows = () =>
                within(table)
                    .getAllByRole('row')
                    .filter((row) => within(row).queryAllByRole('textbox').length > 0);
            const getNames = () =>
                getRows().map((row) => (within(row).getAllByRole('textbox')[0] as HTMLInputElement).value);
            const getDistances = () =>
                getRows().map((row) => Number(within(row).getAllByRole('cell')[1]?.textContent?.replace(' km', '')));

            const initialNames = getNames();
            const initialDistances = getDistances();
            expect(initialDistances.every((distance) => distance > 0)).toBe(true);

            await user.click(screen.getByRole('button', { name: messages['msg.file'] }));
            expect(getNames()).toEqual([...initialNames].sort((first, second) => second.localeCompare(first)));
            await user.click(screen.getByRole('button', { name: messages['msg.file'] }));
            expect(getNames()).toEqual([...initialNames].sort((first, second) => first.localeCompare(second)));

            await user.click(screen.getByRole('button', { name: messages['msg.distanceInKm'] }));
            expect(getDistances()).toEqual([...initialDistances].sort((first, second) => first - second));

            const firstSegment = getParsedGpxSegments(store.getState())[0]!;
            store.dispatch(trackMergeActions.addTrackComposition());
            const track = getTrackCompositions(store.getState())[0]!;
            store.dispatch(
                trackMergeActions.setSegments({
                    id: track.id,
                    segments: [{ id: firstSegment.id, segmentId: firstSegment.id, type: SEGMENT }],
                })
            );

            const usedButton = screen.getByRole('button', { name: messages['msg.segmentUsage.used'] });
            const unusedButton = screen.getByRole('button', { name: messages['msg.segmentUsage.unused'] });
            expect(usedButton).toHaveClass('btn-success');
            expect(unusedButton).toHaveClass('btn-danger');

            await user.click(usedButton);
            expect(getNames()).not.toContain(firstSegment.filename);
            expect(usedButton).toHaveClass('btn-outline-success');
            await user.click(unusedButton);
            expect(getNames()).toHaveLength(3);
            await user.click(unusedButton);
            expect(getNames()).toEqual([firstSegment.filename]);
            await user.click(usedButton);
            expect(getNames()).toHaveLength(3);
        });

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

            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(3), timeout);
            expect(getCalculateTracks(store.getState())).toHaveLength(0);

            await user.click(ui.complexSegmentsTab());
            expect(screen.getByRole('columnheader', { name: messages['msg.calculatedSpeed'] })).toBeInTheDocument();
            expect(screen.getAllByText(/km\/h/)).toHaveLength(3);

            await user.click(ui.complexTracksTab(0));
            await user.click(ui.newTrackButton());
            expect(getTrackCompositions(store.getState())).toHaveLength(1);

            const segmentsTab = screen.getByRole('tab', { name: messages['msg.segments'] });
            const streetsTab = screen.getByRole('tab', { name: messages['msg.streets'] });
            expect(screen.queryByText(messages['msg.description.tracks'])).toBeNull();

            const trackDescriptionButton = screen.getByRole('button', { name: messages['msg.tracks.title'] });
            await user.click(trackDescriptionButton);
            const descriptionDialog = screen.getByRole('dialog');
            await user.click(within(descriptionDialog).getAllByRole('button', { name: messages['msg.close'] })[0]);

            await user.click(streetsTab);
            expect(screen.queryByRole('combobox')).toBeNull();

            await user.click(segmentsTab);

            await user.clear(ui.trackNameInput());
            await user.type(ui.trackNameInput(), 'Track 1');

            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment1'));
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment3'));
            expect(getTrackCompositions(store.getState())[0].segments).toHaveLength(2);

            await waitFor(() => expect(getCalculateTracks(store.getState())).toHaveLength(1), timeout);
            await user.click(streetsTab);
            const insertionRail = screen.getByTestId('street-insertion-rail');
            const insertionButtons = within(insertionRail).getAllByRole('button');
            expect(insertionButtons.length).toBeGreaterThan(1);
            expect(insertionButtons[0]).toHaveClass('btn-outline-secondary', 'p-0');
            expect(insertionButtons[0]).not.toHaveClass('rounded-circle', 'btn-link');
            expect(insertionButtons[0]).toHaveTextContent('+');
            expect(within(screen.getByTestId('track-street-list')).queryByTestId('street-insertion-rail')).toBeNull();
            await user.click(insertionButtons[0]!);
            expect(getStreetPointSelection(store.getState())?.mode).toBe('add-start');
            const activeInsertionButton = within(screen.getByTestId('street-insertion-rail')).getByRole('button', {
                name: messages['msg.cancelAddStreet'],
            });
            await user.click(activeInsertionButton);
            expect(getStreetPointSelection(store.getState())).toBeUndefined();
            const streetTable = screen.getByTestId('track-street-list');
            const streetEntries = within(streetTable).getAllByRole('row');
            expect(streetEntries.length).toBeGreaterThan(1);
            const streetButtons = within(streetEntries[1]!).getAllByRole('button');
            await user.click(streetButtons[0]!);
            expect(getHighlightedStreetPath(store.getState())).toBeDefined();
            expect(getHighlightedStreetPath(store.getState())!.length).toBeGreaterThan(0);
            expect(getHighlightedStreetPath(store.getState())!.every((point) => point.s !== undefined)).toBe(true);
            await user.click(streetButtons[2]!);
            expect(getHighlightedStreetPath(store.getState())).toBeDefined();
            expect(getHighlightedStreetPath(store.getState())!.length).toBeGreaterThan(0);
            await user.click(streetButtons[1]!);
            expect(getStreetPointSelection(store.getState())?.boundary).toBe('start');
            const cancelButtons = within(streetEntries[1]!).getAllByRole('button');
            expect(cancelButtons[1]).toHaveAccessibleName('Cancel editing street start');
            await user.click(cancelButtons[1]!);
            expect(getStreetPointSelection(store.getState())).toBeUndefined();
            await user.click(within(streetEntries[1]!).getAllByRole('button')[1]!);
            expect(getStreetPointSelection(store.getState())?.boundary).toBe('start');
            const firstSegment = getParsedGpxSegments(store.getState())[0]!;
            store.dispatch(mapActions.setSelectedStreetPoint({ segmentId: firstSegment.id, pointIndex: 0 }));
            await waitFor(() => expect(getStreetPointSelection(store.getState())).toBeUndefined());
            await user.click(streetButtons[3]!);
            expect(getStreetPointSelection(store.getState())?.boundary).toBe('end');
            store.dispatch(mapActions.setStreetPointSelection(undefined));
            await user.click(segmentsTab);
            expect(getHighlightedStreetPath(store.getState())).toBeUndefined();

            await user.click(ui.newTrackButton());
            expect(getTrackCompositions(store.getState())).toHaveLength(2);

            await user.clear(ui.trackNameInput());
            await user.type(ui.trackNameInput(), 'Track 2');

            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment2'));
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment3'));
            expect(getTrackCompositions(store.getState())[1].segments).toHaveLength(2);

            await waitFor(() => expect(getCalculateTracks(store.getState())).toHaveLength(2), timeout);
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
            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(1), timeout);
            const firstSegment = getParsedGpxSegments(store.getState())[0];
            await ui.uploadGpxSegment('segment2');
            await ui.uploadGpxSegment('segment3');
            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(3), timeout);

            await ui.splitSegment(firstSegment.id, store.dispatch);
            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(4), timeout);

            const splitSegments = getParsedGpxSegments(store.getState()).filter((segment) =>
                segment.filename.startsWith(`${firstSegment.filename}-`)
            );
            expect(splitSegments).toHaveLength(2);
            expect(splitSegments.map((segment) => segment.points[0]?.t)).toEqual([0, 0]);
        });
    });
});

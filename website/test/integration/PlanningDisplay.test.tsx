import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getSegmentIdClipboard, getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
import { trackMergeActions } from '../../src/planner/store/trackMerge.reducer';
import { SEGMENT } from '../../src/planner/store/types';
import { plannerUi as ui } from './data/PlannerTestAccess';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { getTrackStreetInfos } from '../../src/planner/calculation/getTrackStreetInfos';
import { formatTimeOnly } from '../../src/utils/dateUtil';
import { getGapToleranceInKm } from '../../src/planner/store/settings.reducer';
import { getSelectedTrackId } from '../../src/planner/store/layout.reducer';
import { backendActions } from '../../src/planner/store/backend.reducer';
import {
    getHighlightedStreetPath,
    getPointToCenter,
    getStreetPointSelection,
    mapActions,
} from '../../src/planner/store/map.reducer';

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
            const checksItem = screen
                .getByRole('heading', { name: /unknown elements|All street parts are known and resolved/ })
                .closest('.accordion-item')!;
            expect(
                within(checksItem).getByRole('columnheader', { name: messages['msg.trackName'] })
            ).toBeInTheDocument();
            const priorityAccordion = screen.getByRole('button', { name: messages['msg.prio'] });
            expect(priorityAccordion).toBeInTheDocument();
            await user.click(priorityAccordion);
            expect(screen.getByRole('columnheader', { name: messages['msg.priority'] })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: messages['msg.trackPeople'] })).toBeInTheDocument();
            const communicatedStartItem = screen
                .getByRole('heading', { name: /Published start times/ })
                .closest('.accordion-item')!;
            const communicatedStartAccordion = within(
                communicatedStartItem.querySelector('.accordion-header')!
            ).getByRole('button');
            expect(communicatedStartAccordion).toBeInTheDocument();
            expect(
                screen
                    .getByRole('heading', { name: /Start name overwrite/ })
                    .closest('.accordion-item')!
                    .querySelector('.accordion-header button')!
                    .compareDocumentPosition(communicatedStartAccordion)
            ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
            const nodesAccordion = screen.getByRole('button', { name: messages['msg.nodes'] });
            expect(communicatedStartAccordion.compareDocumentPosition(nodesAccordion)).toBe(
                Node.DOCUMENT_POSITION_FOLLOWING
            );
            await user.click(communicatedStartAccordion);
            expect(within(communicatedStartItem).getByText(messages['msg.publicStart'])).toBeInTheDocument();
            await user.click(nodesAccordion);
            expect(screen.getByText(messages['msg.nodes.specificBehavior'])).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: messages['msg.branches'] })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: messages['msg.type'] })).toBeInTheDocument();
            const nodeInfoButton = within(nodesAccordion.closest('.accordion-item')!).getByRole('button', {
                name: messages['msg.nodes.specificBehavior'],
            });
            await user.click(nodeInfoButton);
            expect(screen.getByText(messages['msg.description.nodes'], { exact: false })).toBeInTheDocument();
            expect(screen.getByText(messages['msg.description.nodes.people'], { exact: false })).toBeInTheDocument();
            expect(screen.getByText(messages['msg.description.nodes.priority'], { exact: false })).toBeInTheDocument();
            expect(
                screen.getByText(messages['msg.description.nodes.percentage'], { exact: false })
            ).toBeInTheDocument();
            const publicLinksAccordion = screen.getByRole('button', { name: messages['msg.publicLinks'] });
            expect(nodesAccordion.compareDocumentPosition(publicLinksAccordion)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
            await user.click(publicLinksAccordion);
            const publicLinksItem = publicLinksAccordion.closest('.accordion-item')!;
            expect(within(publicLinksItem).getByText(messages['msg.publicLinks.unsaved'])).toBeInTheDocument();

            store.dispatch(backendActions.setPlanningId('test-planning'));
            store.dispatch(backendActions.setIsPlanningSaved(true));
            await waitFor(() =>
                expect(within(publicLinksItem).getByRole('link', { name: messages['msg.publicLink'] })).toHaveAttribute(
                    'href',
                    expect.stringContaining('?display=test-planning')
                )
            );
            expect(
                within(publicLinksItem).getByRole('link', { name: messages['msg.publicTableLink'] })
            ).toHaveAttribute('href', expect.stringContaining('?table=test-planning'));
            expect(
                within(publicLinksItem).getByRole('link', { name: messages['msg.publicTableLink.withIndex'] })
            ).toHaveAttribute('target', '_blank');

            await user.click(screen.getByRole('button', { name: messages['msg.settings'] }));
            expect(screen.queryByRole('button', { name: messages['msg.communicatedStart'] })).toBeNull();
            expect(screen.queryByRole('button', { name: messages['msg.nodes'] })).toBeNull();
            expect(screen.queryByRole('button', { name: messages['msg.prio'] })).toBeNull();
            await user.click(screen.getByRole('button', { name: messages['msg.overview'] }));
            const pointsItem = screen
                .getAllByRole('heading', { name: /Points of interest|open problem points/ })
                .find((heading) => heading.tagName === 'H2')!
                .closest('.accordion-item')!;
            const pointsAccordion = within(pointsItem.querySelector('.accordion-header')!).getByRole('button');
            expect(pointsAccordion).toBeInTheDocument();
            await user.click(pointsAccordion);
            const gapToleranceInputs = screen.getAllByTitle(messages['msg.gapTolerance.hint']);
            expect(gapToleranceInputs).toHaveLength(1);
            const pointsOfInterest = screen.getByText(messages['msg.pointsOfInterest']);
            expect(pointsOfInterest).toBeInTheDocument();
            expect(gapToleranceInputs[0]!.compareDocumentPosition(pointsOfInterest)).toBe(
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
        it('inserts breaks and entry points from the segment context menu', async () => {
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
            await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(2), timeout);
            await user.click(ui.complexTracksTab(0));
            await user.click(ui.newTrackButton());
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment1'));
            await user.click(ui.segmentSelect());
            await user.click(screen.getByText('segment2'));

            const firstSegmentId = getTrackCompositions(store.getState())[0]!.segments[0]!.id;
            const segmentActions = within(screen.getByTestId(`track-segment-${firstSegmentId}`)).getAllByRole(
                'button'
            )[1]!;
            await user.click(segmentActions);
            expect(screen.getByText(messages['msg.setColor'])).toBeInTheDocument();
            await user.click(screen.getAllByText(messages['msg.setColor'])[0]!);
            const leftColorDialog = screen.getByRole('dialog');
            const leftColorCloseButtons = within(leftColorDialog).getAllByRole('button', {
                name: messages['msg.close'],
            });
            await user.click(leftColorCloseButtons[leftColorCloseButtons.length - 1]!);
            fireEvent.contextMenu(screen.getByTestId(`track-segment-${firstSegmentId}`));
            await user.click(screen.getAllByText(messages['msg.setColor'])[1]!);
            const colorDialog = screen.getByRole('dialog');
            const colorInput = within(colorDialog).getByRole('textbox');
            await user.click(colorInput);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const colorDialogCloseButtons = within(colorDialog).getAllByRole('button', {
                name: messages['msg.close'],
            });
            await user.click(colorDialogCloseButtons[colorDialogCloseButtons.length - 1]!);

            fireEvent.contextMenu(screen.getByTestId(`track-segment-${firstSegmentId}`));
            await user.click(screen.getByText(messages['msg.addBreakBefore']));
            const breakDialog = screen.getByRole('dialog');
            await user.clear(within(breakDialog).getByTitle(messages['msg.minutes.details']));
            await user.type(within(breakDialog).getByTitle(messages['msg.minutes.details']), '10');
            await user.click(within(breakDialog).getByRole('button', { name: messages['msg.add'] }));

            await waitFor(() => expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(3));
            const trackAfterBreak = getTrackCompositions(store.getState())[0]!;
            expect(trackAfterBreak.segments.map((element) => element.type)).toEqual(['BREAK', 'SEGMENT', 'SEGMENT']);

            fireEvent.contextMenu(screen.getByTestId(`track-segment-${firstSegmentId}`));
            await user.click(screen.getByText(messages['msg.addEntryPointAfter']));
            const entryDialog = screen.getByRole('dialog');
            await user.type(within(entryDialog).getByPlaceholderText(messages['msg.street']), 'Start Street');
            await user.click(within(entryDialog).getByRole('button', { name: messages['msg.add'] }));

            await waitFor(() => expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(4));
            expect(getTrackCompositions(store.getState())[0]!.segments.map((element) => element.type)).toEqual([
                'BREAK',
                'SEGMENT',
                'ENTRY',
                'SEGMENT',
            ]);

            const finalTrack = getTrackCompositions(store.getState())[0]!;
            const breakId = finalTrack.segments.find((element) => element.type === 'BREAK')!.id;
            await user.click(screen.getByLabelText(messages['msg.editBreak']));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const leftBreakCloseButtons = within(screen.getByRole('dialog')).getAllByRole('button', {
                name: messages['msg.close'],
            });
            await user.click(leftBreakCloseButtons[leftBreakCloseButtons.length - 1]!);

            fireEvent.contextMenu(screen.getByTestId(`track-break-${breakId}`));
            await user.click(screen.getByText(messages['msg.editBreak']));
            const breakEditDialog = screen.getByRole('dialog');
            expect(breakEditDialog).toBeInTheDocument();
            const breakCloseButtons = within(breakEditDialog).getAllByRole('button', { name: messages['msg.close'] });
            await user.click(breakCloseButtons[breakCloseButtons.length - 1]!);

            fireEvent.contextMenu(screen.getByTestId(`track-break-${breakId}`));
            await user.click(screen.getByText(messages['msg.removeBreakSegment']));
            const breakDeleteDialog = screen.getByRole('dialog');
            const breakDeleteCloseButtons = within(breakDeleteDialog).getAllByRole('button', {
                name: messages['msg.close'],
            });
            await user.click(breakDeleteCloseButtons[breakDeleteCloseButtons.length - 1]!);
            expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(4);

            fireEvent.contextMenu(screen.getByTestId(`track-break-${breakId}`));
            await user.click(screen.getByText(messages['msg.removeBreakSegment']));
            await user.click(screen.getByRole('button', { name: messages['msg.confirm'] }));
            expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(3);

            const entryId = finalTrack.segments.find((element) => element.type === 'ENTRY')!.id;
            await user.click(screen.getByLabelText(messages['msg.editEntryPoint']));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            const leftEntryCloseButtons = within(screen.getByRole('dialog')).getAllByRole('button', {
                name: messages['msg.close'],
            });
            await user.click(leftEntryCloseButtons[leftEntryCloseButtons.length - 1]!);

            fireEvent.contextMenu(screen.getByTestId(`track-entry-point-${entryId}`));
            await user.click(screen.getByText(messages['msg.editEntryPoint']));
            const entryEditDialog = screen.getByRole('dialog');
            expect(entryEditDialog).toBeInTheDocument();
            const entryCloseButtons = within(entryEditDialog).getAllByRole('button', { name: messages['msg.close'] });
            await user.click(entryCloseButtons[entryCloseButtons.length - 1]!);

            fireEvent.contextMenu(screen.getByTestId(`track-entry-point-${entryId}`));
            await user.click(screen.getByText(messages['msg.removeEntryPoint']));
            const entryDeleteDialog = screen.getByRole('dialog');
            await user.click(within(entryDeleteDialog).getByRole('button', { name: messages['msg.confirm'] }));
            expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(2);

            await user.click(screen.getAllByRole('button', { name: 'X' }).at(-1)!);
            expect(getTrackCompositions(store.getState())[0]!.segments).toHaveLength(1);
        });

        it('opens track actions from a right-click menu without changing the selected track', async () => {
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
            await user.click(ui.complexTracksTab(0));
            await user.click(ui.newTrackButton());
            await user.click(ui.newTrackButton());

            const tracks = getTrackCompositions(store.getState());
            const firstTrack = tracks[0]!;
            const secondTrack = tracks[1]!;
            store.dispatch(trackMergeActions.setTrackName({ id: firstTrack.id, trackName: 'First track' }));
            store.dispatch(trackMergeActions.setTrackName({ id: secondTrack.id, trackName: 'Second track' }));
            expect(getSelectedTrackId(store.getState())).toBe(secondTrack.id);

            fireEvent.contextMenu(screen.getByTestId(`track-tab-${firstTrack.id}`));

            const contextMenu = await screen.findByTestId('track-context-menu');
            expect(within(contextMenu).getByText(messages['msg.removeTrack'])).toBeInTheDocument();
            expect(within(contextMenu).getByText(messages['msg.copySegments'])).toBeInTheDocument();
            expect(within(contextMenu).getByText(messages['msg.pasteSegments'])).toBeInTheDocument();
            expect(within(contextMenu).getByText(messages['msg.setColor'])).toBeInTheDocument();
            expect(getSelectedTrackId(store.getState())).toBe(secondTrack.id);

            await user.click(within(contextMenu).getByText(messages['msg.setColor']));
            const colorDialog = screen.getByRole('dialog');
            const colorInput = within(colorDialog).getByRole('textbox');
            await user.click(colorInput);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.clear(colorInput);
            await user.type(colorInput, '123456');
            await user.click(within(colorDialog).getByRole('button', { name: messages['msg.confirm'] }));
            expect(screen.queryByRole('dialog')).toBeNull();
            expect(getTrackCompositions(store.getState()).find((track) => track.id === firstTrack.id)?.color).toBe(
                '#123456'
            );

            fireEvent.contextMenu(screen.getByTestId(`track-tab-${firstTrack.id}`));
            const colorContextMenu = await screen.findByTestId('track-context-menu');
            await user.click(within(colorContextMenu).getByText(messages['msg.copySegments']));
            expect(getSegmentIdClipboard(store.getState())).toEqual(firstTrack.segments);
            expect(screen.queryByTestId('track-context-menu')).toBeNull();
        });

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
            const infoTab = screen.getByRole('tab', { name: messages['msg.info'] });
            await user.click(infoTab);
            const infoRow = screen.getByText(messages['msg.startName']).closest('.row');
            expect(infoRow).toBeInTheDocument();
            const infoColumns = Array.from(infoRow!.querySelectorAll('.col'));
            expect(infoColumns).toHaveLength(3);
            expect(infoColumns.map((column) => column.textContent)).toEqual([
                messages['msg.startName'],
                messages['msg.buffer'],
                messages['msg.rounding'],
            ]);
            const bufferInput = within(infoColumns[1] as HTMLElement).getByRole('textbox');
            const roundingInput = within(infoColumns[2] as HTMLElement).getByRole('textbox');
            expect(bufferInput).toBeDefined();
            expect(roundingInput).toBeDefined();
            await user.type(bufferInput!, '5');
            await user.type(roundingInput!, '10');
            await waitFor(() => {
                expect(getTrackCompositions(store.getState())[0]).toMatchObject({ buffer: 5, rounding: 10 });
            });
            const infoSummary = screen
                .getByRole('columnheader', { name: messages['msg.publicStart'] })
                .closest('table')!;
            const infoHeaders = within(infoSummary).getAllByRole('columnheader');
            expect(infoHeaders.slice(0, 2).map((header) => header.textContent)).toEqual([
                messages['msg.publicStart'],
                messages['msg.start'],
            ]);
            expect(within(infoSummary).getAllByRole('cell')[0]).toHaveTextContent(
                formatTimeOnly(getTrackStreetInfos(store.getState())[0]!.publicStart!)
            );
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
            expect(
                within(streetTable)
                    .getAllByRole('columnheader')
                    .map((header) => header.textContent)
            ).toEqual([
                messages['msg.start'],
                messages['msg.end'],
                messages['msg.street'],
                messages['msg.postCode'],
                messages['msg.district'],
                messages['msg.length'],
                messages['msg.streetPoints'],
            ]);
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
            const editedStreetRow = within(screen.getByTestId('track-street-list')).getAllByRole('row')[1]!;
            await user.click(within(editedStreetRow.cells[2]!).getByAltText('upload file'));
            const streetEditDialog = screen.getByRole('dialog');
            const streetEditInput = within(streetEditDialog).getByRole('textbox');
            await user.clear(streetEditInput);
            await user.type(streetEditInput, 'Edited street');
            await user.click(within(streetEditDialog).getByRole('button', { name: messages['msg.confirm'] }));
            await waitFor(() =>
                expect(getTrackStreetInfos(store.getState())[0]!.wayPoints[0]!.streetName).toBe('Edited street')
            );
            const refreshedStreetRow = within(screen.getByTestId('track-street-list')).getAllByRole('row')[1]!;
            await user.click(within(refreshedStreetRow).getAllByRole('button')[3]!);
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

            await user.click(screen.getByRole('button', { name: messages['msg.overview'] }));
            const startNameItem = screen
                .getByRole('heading', { name: /Start name overwrite/ })
                .closest('.accordion-item')!;
            const startNameAccordion = within(startNameItem.querySelector('.accordion-header')!).getByRole('button');
            await user.click(startNameAccordion);
            const startNameTable = within(startNameItem).getByRole('table');
            expect(
                within(startNameTable)
                    .getAllByRole('columnheader')
                    .map((header) => header.textContent)
            ).toEqual([messages['msg.trackName'], messages['msg.publicStart'], messages['msg.startName']]);
            const firstStreetName = getTrackStreetInfos(store.getState())[0]!.wayPoints[0]!.streetName;
            const startNameRows = within(startNameTable).getAllByRole('row');
            expect(within(startNameRows[1]!).getAllByRole('cell')[1]).toHaveTextContent(
                firstStreetName ?? messages['msg.unknown']
            );
            expect(within(startNameTable).getAllByRole('textbox')).toHaveLength(2);
            const startLinks = within(startNameTable).getAllByRole('button', { name: messages['msg.goToStart'] });
            expect(startLinks).toHaveLength(2);
            const firstStartPoint = getTrackStreetInfos(store.getState())[0]!.wayPoints[0]!.pointFrom;
            let centeredPoint: ReturnType<typeof getPointToCenter>;
            const unsubscribe = store.subscribe(() => {
                const point = getPointToCenter(store.getState());
                if (point) {
                    centeredPoint = point;
                }
            });
            await user.click(startLinks[0]!);
            unsubscribe();
            expect(centeredPoint).toMatchObject({
                lat: firstStartPoint.lat,
                lng: firstStartPoint.lon + 0.01,
                zoom: 15,
            });

            const firstTrack = getTrackCompositions(store.getState())[0]!;
            store.dispatch(trackMergeActions.setTrackStartName({ id: firstTrack.id, startName: 'Published start' }));
            const firstPublishedCell = within(startNameTable).getAllByRole('row')[1]!.querySelectorAll('td')[1]!;
            await waitFor(() => expect(firstPublishedCell).toHaveTextContent('Published start'));
            expect(firstPublishedCell.querySelector('span')).toHaveStyle({ fontWeight: 'bold' });
            expect(firstPublishedCell.querySelector('span')).toHaveAttribute(
                'title',
                firstStreetName ?? messages['msg.unknown']
            );

            const unknownOriginalStartNames = getTrackCompositions(store.getState()).filter((track) => {
                const firstStreetName = getTrackStreetInfos(store.getState()).find((info) => info.id === track.id)
                    ?.wayPoints[0]?.streetName;
                return (!firstStreetName || firstStreetName === messages['msg.unknown']) && !track.startName?.trim();
            }).length;
            if (unknownOriginalStartNames === 0) {
                expect(
                    within(startNameAccordion.closest('.accordion-item')!).getByAltText('checkIcon')
                ).toBeInTheDocument();
            } else {
                expect(startNameAccordion).toHaveTextContent(String(unknownOriginalStartNames));
            }

            await user.click(screen.getByTitle(messages['msg.downloads']));
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

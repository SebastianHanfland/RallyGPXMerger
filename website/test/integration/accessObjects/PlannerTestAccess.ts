import { act, fireEvent, screen, within } from '@testing-library/react';
import { AppDispatch } from '../../../src/planner/store/planningStore';
import { splitGpxAtPosition } from '../../../src/planner/segments/actions/splitSegmentThunk';
import { getMessages } from '../../../src/lang/getMessages';
import { segmentDataActions } from '../../../src/planner/store/segmentData.redux';
import { segment1 } from '../data/segment1';
import { segment2 } from '../data/segment2';
import { segment3 } from '../data/segment3';

const messages = getMessages('en');

export const plannerUi = {
    startButton: () => screen.getByRole('button', { name: RegExp(messages['msg.startPlan']) }),
    importPlanButton: () => screen.getByRole('button', { name: RegExp(messages['msg.loadPlan']) }),
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
    overviewButton: () => screen.getByRole('button', { name: messages['msg.overview'] }),
    settingsButton: () => screen.getByRole('button', { name: messages['msg.settings'] }),
    button: (name: string) => screen.getByRole('button', { name }),
    absentButton: (name: string) => screen.queryByRole('button', { name }),
    segmentsTab: () => screen.getByRole('tab', { name: messages['msg.segments'] }),
    streetsTab: () => screen.getByRole('tab', { name: messages['msg.streets'] }),
    infoTab: () => screen.getByRole('tab', { name: messages['msg.info'] }),
    segmentOption: (name: string) => screen.getByText(name),
    segmentTable: () => screen.getByRole('table'),
    segmentFilter: () => screen.getByPlaceholderText(messages['msg.filterSegments']),
    segmentSortButton: (name: string) => screen.getByRole('button', { name }),
    usedSegmentsButton: () => screen.getByRole('button', { name: messages['msg.segmentUsage.used'] }),
    unusedSegmentsButton: () => screen.getByRole('button', { name: messages['msg.segmentUsage.unused'] }),
    trackTab: (id: string) => screen.getByTestId(`track-tab-${id}`),
    trackContextMenu: () => screen.getByTestId('track-context-menu'),
    segmentContextMenuItem: (name: string) => screen.getByText(name),
    trackDescriptionButton: () => screen.getByRole('button', { name: messages['msg.tracks.title'] }),
    trackSegment: (id: string) => screen.getByTestId(`track-segment-${id}`),
    trackBreak: (id: string) => screen.getByTestId(`track-break-${id}`),
    trackEntryPoint: (id: string) => screen.getByTestId(`track-entry-point-${id}`),
    trackStreetList: () => screen.getByTestId('track-street-list'),
    streetInsertionRail: () => screen.getByTestId('street-insertion-rail'),
    activeAddStreetButton: () => screen.getByRole('button', { name: messages['msg.cancelAddStreet'] }),
    streetRow: (index: number) => within(screen.getByTestId('track-street-list')).getAllByRole('row')[index]!,
    streetAction: (row: HTMLElement, index: number) => within(row).getAllByRole('button')[index]!,
    streetColumnHeaders: () => within(screen.getByTestId('track-street-list')).getAllByRole('columnheader'),
    dialog: () => screen.getByRole('dialog'),
    closeDialog: () => {
        const buttons = within(screen.getByRole('dialog')).getAllByRole('button', { name: messages['msg.close'] });
        return buttons[buttons.length - 1]!;
    },
    confirmDialog: () => within(screen.getByRole('dialog')).getByRole('button', { name: messages['msg.confirm'] }),
    addDialog: () => within(screen.getByRole('dialog')).getByRole('button', { name: messages['msg.add'] }),
    overviewAccordion: (name: string | RegExp) =>
        screen.getByRole('heading', { name }).closest<HTMLElement>('.accordion-item')!,
    flowOverviewButton: () => screen.getByRole('button', { name: messages['msg.flowOverview'] }),
    cloudActionsButton: () => screen.getByTitle(messages['msg.cloudActions']),
    downloadsButton: () => screen.getByTitle(messages['msg.downloads']),
    uploadGpxSegment: async (fileName: 'segment1' | 'segment2' | 'segment3') => {
        const fileInput = screen.queryByText(/upload the/) ?? screen.queryByText(/Successfully/);
        const inputElement = fileInput?.parentNode?.parentNode;
        let fileContent = '';
        if (fileName === 'segment1') {
            fileContent = segment1;
        }
        if (fileName === 'segment2') {
            fileContent = segment2;
        }
        if (fileName === 'segment3') {
            fileContent = segment3;
        }
        const textEncoder = new TextEncoder();
        const file = new File([fileContent], `${fileName}.gpx`, { type: 'application/gpx+xml' });
        file.arrayBuffer = () => Promise.resolve(textEncoder.encode(fileContent) as unknown as ArrayBuffer);
        await act(() => fireEvent.drop(inputElement!, { dataTransfer: { files: [file] } }));
    },
    uploadNode: () => {
        const loadLabel = screen.getByText(messages['msg.loadPlan']);
        return loadLabel?.parentNode?.parentNode?.parentNode?.childNodes[1] as HTMLElement;
    },
    splitSegment: async (segmentId: string, dispatch: AppDispatch) => {
        const actionPayload = { segmentId, lat: 48.128275, lng: 11.630246 };
        await act(() => dispatch(segmentDataActions.setClickOnSegment(actionPayload)));
        await act(() => dispatch(splitGpxAtPosition));
    },
    pdfDownloadButton: () => screen.getByRole('button', { name: /PDF/ }),
    newTrackButton: () => screen.getByText(messages['msg.addNewTrack'], { exact: false }),
    trackNameInput: () => screen.getByPlaceholderText('Track name'),
    bufferInput: () => screen.getByPlaceholderText(messages['msg.buffer']),
    roundingInput: () => screen.getByPlaceholderText(messages['msg.rounding']),
    segmentSelect: () => screen.getByRole('combobox'),
    textMatching: (pattern: RegExp) => screen.getAllByText(pattern),
};

import { act, fireEvent, screen } from '@testing-library/react';
import { AppDispatch } from '../../../src/planner/store/planningStore';
import { splitGpxAtPosition } from '../../../src/planner/segments/splitSegmentThunk';
import { getMessages } from '../../../src/lang/getMessages';
import { segmentDataActions } from '../../../src/planner/store/segmentData.redux.ts';
import { segment1 } from './segment1.ts';
import { segment2 } from './segment2.ts';
import { segment3 } from './segment3.ts';

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
    segmentSelect: () => screen.getByRole('combobox'),
};

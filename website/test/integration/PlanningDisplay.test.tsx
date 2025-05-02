import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getGpxSegments, gpxSegmentsActions } from '../../src/planner/store/gpxSegments.reducer';
import * as fs from 'node:fs';
import { splitGpxAtPosition } from '../../src/planner/segments/splitSegmentThunk';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/streets/mapMatchingStreetResolver');

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
    complexTracksTab: () => screen.getByRole('button', { name: messages['msg.tracks'] }),
    uploadGpxSegment: async (fileName: string) => {
        const fileInput = screen.queryByText(/upload the/) ?? screen.queryByText(/Successfully/);
        const inputElement = fileInput.parentNode.parentNode;
        const buffer = fs.readFileSync(`./test/integration/data/${fileName}.gpx`);
        const file = new File([buffer], `${fileName}.gpx`, { type: 'application/gpx+xml' });
        file.arrayBuffer = () => Promise.resolve(buffer.buffer);
        await act(() => fireEvent.drop(inputElement, { dataTransfer: { files: [file] } }));
    },
};

describe('Planner integration test', () => {
    it('Starts a new simple planning', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        render(<RallyPlannerWrapper store={store} />, { wrapper: BrowserRouter });

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
        render(<RallyPlannerWrapper store={store} />, { wrapper: BrowserRouter });

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
        ui.complexTracksTab();
    });

    it('splitting a segment into two', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        render(<RallyPlannerWrapper store={store} />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await user.click(ui.startButton());
        await user.click(ui.complexButton());
        await ui.uploadGpxSegment('segment1');
        const listWithFirstSegment = getGpxSegments(store.getState());
        expect(listWithFirstSegment).toHaveLength(1);
        const firstSegment = listWithFirstSegment[0];
        await ui.uploadGpxSegment('segment2');
        screen.debug();
        await ui.uploadGpxSegment('segment3');
        expect(getGpxSegments(store.getState())).toHaveLength(3);

        // simulate split click
        const actionPayload = { segmentId: firstSegment.id, lat: 48.128275, lng: 11.630246 };
        await act(() => store.dispatch(gpxSegmentsActions.setClickOnSegment(actionPayload)));
        await act(() => store.dispatch(splitGpxAtPosition(store.dispatch, store.getState)));

        expect(getGpxSegments(store.getState())).toHaveLength(4);
    });
});

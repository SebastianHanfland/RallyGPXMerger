import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getGpxSegments } from '../../src/planner/store/gpxSegments.reducer';
import * as fs from 'node:fs';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');

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
};

describe('Planner integration test', () => {
    it('Starts a new simple planning', async () => {
        // given
        // const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        // const state = JSON.parse(buffer) as State;

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

    it('splitting a segment into two', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        render(<RallyPlannerWrapper store={store} />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await user.click(ui.startButton());
        await user.click(ui.complexButton());

        ui.complexSegmentsTab();
        ui.complexTracksTab();
        const fileInput = screen.getByText(/upload the/);
        const inputElement = fileInput.parentNode.parentNode;
        console.log(inputElement);
        const buffer = fs.readFileSync('./test/integration/segment1.gpx').buffer;
        const file = new File([buffer], 'segment1');
        file.arrayBuffer = () => Promise.resolve(new ArrayBuffer(3));

        // await user.click(inputElement);
        fireEvent.focus(inputElement);
        fireEvent.change(inputElement, { target: { files: [file] } });
        // fireEvent.drop(inputElement, { target: { files: [file] } });
        act(() =>
            fireEvent.drop(inputElement, {
                dataTransfer: { files: [file] },
                // target: { files: [file] },
            })
        );

        // await user.upload(inputElement as HTMLElement, file);

        expect(getGpxSegments(store.getState())).toHaveLength(1);
    });
});

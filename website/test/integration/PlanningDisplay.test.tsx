import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';
import { Simulate } from 'react-dom/test-utils';
import click = Simulate.click;

const messages = getMessages('en');

// vi.mock('../../src/utils/linkUtil');
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
};

describe('Planner integration test', () => {
    it('Starts a new simple planning', async () => {
        // given
        // const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        // const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        // (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        // (getData as Mock).mockResolvedValue({ data: state });
        render(<RallyPlannerWrapper />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        ui.header();
        ui.startButton();
        ui.openButton();
        ui.continueButton(false);

        await user.click(ui.startButton());
        screen.debug();
        await waitFor(() => screen.getByText(/Simple/));
    });
});

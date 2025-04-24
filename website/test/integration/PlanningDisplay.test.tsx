import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getMessages } from '../../src/lang/getMessages';

const messages = getMessages('en');

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');

describe('Planner integration test', () => {
    it('Starts a new simple planning', async () => {
        // given
        // const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        // const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        // (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        // (getData as Mock).mockResolvedValue({ data: state });
        await act(() =>
            render(
                <BrowserRouter>
                    <RallyPlannerWrapper />
                </BrowserRouter>
            )
        );

        screen.getByRole('heading', { name: 'Rally GPX Merger' });
        screen.getByRole('button', { name: RegExp(messages['msg.startPlan']) });
        expect(screen.queryByRole('button', { name: RegExp(messages['msg.continuePlan']) })).toBeNull();
        screen.getByRole('button', { name: RegExp(messages['msg.loadPlan']) });
    });
});

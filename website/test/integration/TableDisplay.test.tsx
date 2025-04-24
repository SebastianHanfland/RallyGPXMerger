import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { RallyTableWrapper } from '../../src/versions/RallyTableWrapper';
import { Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');

describe('Render a table and ensure the presence of fields', () => {
    it('should find a node', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue({ data: state });
        const loadingPage = act(() =>
            render(
                <BrowserRouter>
                    <RallyTableWrapper />
                </BrowserRouter>
            )
        );
        screen.getByText('Loading');
        await loadingPage;

        screen.getByText('Ride of Silence 2024');
        ['Name', 'Start', 'Ziel', 'Länge in km', 'Dateien'].forEach((text) => screen.getByText(text));
        screen.getByRole('button', { name: /GPX/ });
        screen.getByRole('button', { name: /PDF/ });
    });
});

import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { RallyTableWrapper } from '../../src/versions/RallyTableWrapper';
import { Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { extendReadableTracks, getReadableTracks } from '../../src/versions/cache/readableTracks';
import { ReadableTrack } from '../../src/common/types';

export const CCom = () => {
    return <div>Dummy</div>;
};

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');

let readableTracks = undefined;
describe('dummy render test', () => {
    it('should find a node', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getReadableTracks as Mock).mockImplementation(() => readableTracks);
        (extendReadableTracks as Mock).mockImplementation((newReadableTracks: ReadableTrack[]) => {
            if (readableTracks === undefined) {
                readableTracks = newReadableTracks;
            } else {
                readableTracks = [...readableTracks, ...newReadableTracks];
            }
        });
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

        screen.debug();
        screen.getByText('Ride of Silence 2024');
    });
});

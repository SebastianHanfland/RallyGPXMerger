import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { RallyTableWrapper } from '../../src/versions/RallyTableWrapper';
import { Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';

export const CCom = () => {
    return <div>Dummy</div>;
};

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');



describe('dummy render test', () => {
    it('should find a node', () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;


        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue({data: state});
        act(() => render(<BrowserRouter><RallyTableWrapper/></BrowserRouter>));

        screen.getByRole('wtf')
        screen.getByText('Loading')
    });
});

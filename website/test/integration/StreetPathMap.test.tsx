import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { App } from '../../src/App.tsx';
import { createStreetPathUrl } from '../../src/utils/streetPathUrl.ts';
import { getData } from '../../src/api/api.ts';

vi.mock('../../src/api/api.ts');
vi.mock('leaflet.locatecontrol', () => ({ LocateControl: vi.fn() }));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => ({}) } }));
vi.mock('../../src/street-path/StreetPathMap.tsx', () => ({
    StreetPathMapWrapper: ({ encodedPath, streetName }: { encodedPath: string; streetName?: string }) => (
        <div data-testid="street-path-map" data-path={encodedPath}>
            {streetName}
        </div>
    ),
}));

describe('street path top-level view', () => {
    it('takes precedence and does not load planning data', () => {
        const generatedUrl = new URL(
            createStreetPathUrl(
                [
                    { lat: 48, lon: 11 },
                    { lat: 48.1, lon: 11.1 },
                ],
                'Äußere Straße'
            )
        );

        render(
            <MemoryRouter initialEntries={[`${generatedUrl.search}&display=planning-id`]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('street-path-map')).toHaveTextContent('Äußere Straße');
        expect(screen.getByTestId('street-path-map')).toHaveAttribute(
            'data-path',
            generatedUrl.searchParams.get('streetpath')
        );
        expect(getData).not.toHaveBeenCalled();
    });

    it('routes an empty streetpath value to the standalone view', () => {
        render(
            <MemoryRouter initialEntries={['/?streetpath=']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('street-path-map')).toHaveAttribute('data-path', '');
        expect(getData).not.toHaveBeenCalled();
    });
});

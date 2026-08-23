import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { createStreetPathUrl } from '../../utils/streetPathUrl.ts';
import { StreetPathMapWrapper } from '../StreetPathMap.tsx';

const leafletMocks = vi.hoisted(() => {
    const map = {
        fitBounds: vi.fn(),
        remove: vi.fn(),
        setView: vi.fn(),
    };
    const line = { getBounds: vi.fn(() => 'bounds') };
    return {
        map,
        line,
        createMap: vi.fn(() => map),
        createPolyline: vi.fn(() => ({ ...line, addTo: vi.fn(() => line) })),
        createCircleMarker: vi.fn(() => ({ addTo: vi.fn() })),
    };
});

vi.mock('../../language.ts', () => ({ getLanguage: () => 'en' }));
vi.mock('leaflet', () => ({
    default: {
        map: leafletMocks.createMap,
        tileLayer: () => ({ addTo: vi.fn() }),
        control: { scale: () => ({ addTo: vi.fn() }) },
        latLng: (lat: number, lng: number) => ({ lat, lng }),
        polyline: leafletMocks.createPolyline,
        circleMarker: leafletMocks.createCircleMarker,
    },
}));

describe('StreetPathMap', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the decoded polyline, fits its bounds, and displays the street name', () => {
        const url = new URL(
            createStreetPathUrl(
                [
                    { lat: 48, lon: 11 },
                    { lat: 48.1, lon: 11.1 },
                ],
                'Main Street'
            )
        );

        render(
            <StreetPathMapWrapper
                encodedPath={url.searchParams.get('streetpath')!}
                streetName={url.searchParams.get('streetname')!}
            />
        );

        expect(screen.getByRole('heading', { name: 'Main Street' })).toHaveStyle({ left: '56px' });
        expect(document.title).toBe('Main Street');
        expect(leafletMocks.createPolyline).toHaveBeenCalledTimes(1);
        expect(leafletMocks.map.fitBounds).toHaveBeenCalledWith('bounds', {
            padding: [24, 24],
            maxZoom: 18,
        });
    });

    it('shows a friendly error without creating a map for invalid geometry', () => {
        render(<StreetPathMapWrapper encodedPath="" />);

        expect(
            screen.getByRole('heading', { name: 'This street path link is invalid or incomplete.' })
        ).toBeInTheDocument();
        expect(leafletMocks.createMap).not.toHaveBeenCalled();
    });
});

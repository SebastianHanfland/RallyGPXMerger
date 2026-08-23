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
        createMarker: vi.fn(() => ({ addTo: vi.fn() })),
        createDivIcon: vi.fn((options: unknown) => options),
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
        marker: leafletMocks.createMarker,
        divIcon: leafletMocks.createDivIcon,
        icon: (options: unknown) => options,
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
        expect(leafletMocks.createMarker).toHaveBeenCalledTimes(3);
        expect(leafletMocks.createMarker).toHaveBeenNthCalledWith(
            1,
            { lat: 48, lng: 11 },
            expect.objectContaining({ title: 'Start of street segment' })
        );
        expect(leafletMocks.createMarker).toHaveBeenNthCalledWith(
            2,
            { lat: 48.1, lng: 11.1 },
            expect.objectContaining({ title: 'End of street segment' })
        );
        expect(leafletMocks.createDivIcon).toHaveBeenCalledWith(
            expect.objectContaining({ html: expect.stringContaining('transform:rotate(') })
        );
        expect(leafletMocks.createMarker).toHaveBeenNthCalledWith(
            3,
            expect.anything(),
            expect.objectContaining({ title: 'Driving direction' })
        );
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

    it('keeps the point marker when the path has no direction', () => {
        const url = new URL(createStreetPathUrl([{ lat: 48, lon: 11 }], 'Single point'));

        render(
            <StreetPathMapWrapper
                encodedPath={url.searchParams.get('streetpath')!}
                streetName={url.searchParams.get('streetname')!}
            />
        );

        expect(leafletMocks.createCircleMarker).not.toHaveBeenCalled();
        expect(leafletMocks.createMarker).toHaveBeenCalledWith(
            { lat: 48, lng: 11 },
            expect.objectContaining({ title: 'Single point' })
        );
    });
});

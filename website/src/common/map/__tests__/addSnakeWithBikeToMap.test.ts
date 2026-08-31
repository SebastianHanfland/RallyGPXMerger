import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addBikeSnakesToLayer } from '../addSnakeWithBikeToMap.ts';

const leafletMocks = vi.hoisted(() => ({
    icon: vi.fn(() => ({})),
    marker: vi.fn(() => ({ addTo: vi.fn() })),
    polyline: vi.fn(() => ({ addTo: vi.fn() })),
}));

vi.mock('leaflet', () => ({
    default: leafletMocks,
}));

describe('addBikeSnakesToLayer', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders snakes independently of calculated-track visibility', () => {
        const clearLayers = vi.fn();
        const layer = { current: { clearLayers } } as never;
        const snake = {
            points: [
                { lat: 48, lng: 11 },
                { lat: 48.1, lng: 11.1 },
            ],
            color: 'red',
            id: 'track-1',
            title: 'Track 1',
        };

        addBikeSnakesToLayer(layer, [snake]);

        expect(clearLayers).toHaveBeenCalledOnce();
        expect(leafletMocks.marker).toHaveBeenCalledWith(
            { lat: 48.1, lng: 11.1 },
            expect.objectContaining({ title: 'Track 1' })
        );
        expect(leafletMocks.polyline).toHaveBeenCalledWith(snake.points, {
            weight: 20,
            color: 'red',
            opacity: 1,
        });
    });
});

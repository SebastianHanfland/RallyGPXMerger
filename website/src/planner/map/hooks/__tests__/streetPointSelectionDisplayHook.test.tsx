import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SEGMENT, TrackComposition } from '../../../store/types.ts';
import { mapActions, mapReducer } from '../../../store/map.reducer.ts';
import { segmentDataReducer, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { trackMergeActions, trackMergeReducer } from '../../../store/trackMerge.reducer.ts';
import { streetPointSelectionDisplayHook } from '../streetPointSelectionDisplayHook.ts';

const leafletMocks = vi.hoisted(() => ({
    circleMarker: vi.fn(() => ({ addTo: vi.fn(), bindTooltip: vi.fn(), on: vi.fn() })),
}));

vi.mock('leaflet', async (importOriginal) => {
    const actual = await importOriginal<typeof import('leaflet')>();
    return { ...actual, default: { ...actual, circleMarker: leafletMocks.circleMarker } };
});

describe('streetPointSelectionDisplayHook', () => {
    it('clears safely when the selected track is no longer available', () => {
        const store = configureStore({
            reducer: { map: mapReducer, segmentData: segmentDataReducer, trackMerge: trackMergeReducer },
        });
        const clearLayers = vi.fn();
        const layer = { current: { clearLayers } } as never;
        const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

        act(() =>
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'missing',
                    streetIndex: 1,
                    boundary: 'start',
                    range: { start: 0, end: 0 },
                })
            )
        );

        expect(() => renderHook(() => streetPointSelectionDisplayHook(layer), { wrapper })).not.toThrow();
        expect(clearLayers).toHaveBeenCalled();
    });

    it('renders eligible points in color and disabled points in grey', () => {
        const store = configureStore({
            reducer: { map: mapReducer, segmentData: segmentDataReducer, trackMerge: trackMergeReducer },
        });
        const track: TrackComposition = {
            id: 'track',
            segments: [{ id: 'segment', segmentId: 'segment', type: SEGMENT }],
        };
        const layer = { current: { clearLayers: vi.fn() } } as never;
        const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

        act(() => store.dispatch(trackMergeActions.addTrackComposition(track)));
        act(() =>
            store.dispatch(
                segmentDataActions.addGpxSegments([
                    {
                        id: 'segment',
                        filename: 'segment',
                        points: [
                            { b: 48, l: 11, e: 0, t: 0, s: 1 },
                            { b: 48.1, l: 11.1, e: 0, t: 1, s: 2 },
                        ],
                    },
                ])
            )
        );
        act(() =>
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'track',
                    streetIndex: 1,
                    boundary: 'start',
                    range: { start: 0, end: 0 },
                })
            )
        );

        renderHook(() => streetPointSelectionDisplayHook(layer), { wrapper });

        expect(leafletMocks.circleMarker).toHaveBeenNthCalledWith(
            1,
            { lat: 48, lng: 11 },
            expect.objectContaining({ color: '#198754', radius: 10, pane: 'streetPointSelection' })
        );
        expect(leafletMocks.circleMarker).toHaveBeenNthCalledWith(
            2,
            { lat: 48.1, lng: 11.1 },
            expect.objectContaining({ color: '#808080' })
        );
        expect(leafletMocks.circleMarker.mock.results[0]!.value.on).toHaveBeenCalledWith('click', expect.any(Function));
        expect(leafletMocks.circleMarker.mock.results[1]!.value.on).not.toHaveBeenCalled();
    });

    it('redraws markers when the selected boundary range changes', () => {
        const store = configureStore({
            reducer: { map: mapReducer, segmentData: segmentDataReducer, trackMerge: trackMergeReducer },
        });
        const clearLayers = vi.fn();
        const layer = { current: { clearLayers } } as never;
        const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
        const track: TrackComposition = {
            id: 'track',
            segments: [{ id: 'segment', segmentId: 'segment', type: SEGMENT }],
        };

        act(() => store.dispatch(trackMergeActions.addTrackComposition(track)));
        act(() =>
            store.dispatch(
                segmentDataActions.addGpxSegments([
                    {
                        id: 'segment',
                        filename: 'segment',
                        points: [
                            { b: 48, l: 11, e: 0, t: 0, s: 1 },
                            { b: 48.1, l: 11.1, e: 0, t: 1, s: 1 },
                            { b: 48.2, l: 11.2, e: 0, t: 2, s: 2 },
                        ],
                    },
                ])
            )
        );
        act(() =>
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'track',
                    streetIndex: 1,
                    boundary: 'end',
                    range: { start: 0, end: 1 },
                })
            )
        );

        renderHook(() => streetPointSelectionDisplayHook(layer), { wrapper });
        const initialMarkerCount = leafletMocks.circleMarker.mock.calls.length;
        const initialClearCount = clearLayers.mock.calls.length;

        act(() =>
            store.dispatch(
                mapActions.setStreetPointSelection({
                    trackId: 'track',
                    streetIndex: 1,
                    boundary: 'end',
                    range: { start: 0, end: 2 },
                })
            )
        );

        expect(clearLayers.mock.calls.length).toBeGreaterThan(initialClearCount);
        expect(leafletMocks.circleMarker.mock.calls.length).toBeGreaterThan(initialMarkerCount);
        expect(leafletMocks.circleMarker).toHaveBeenLastCalledWith(
            { lat: 48.2, lng: 11.2 },
            expect.objectContaining({ color: '#198754', radius: 10, pane: 'streetPointSelection' })
        );
    });
});

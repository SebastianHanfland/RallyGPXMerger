import { describe, expect, it, vi } from 'vitest';
import { SEGMENT, ParsedPoint, TrackComposition } from '../../store/types.ts';
import { getRoutePointReferences } from '../../logic/resolving/streets/streetRangeEditing.ts';
import { abortStreetSelection, applyStreetSelection, beginNewStreet, getStreetPath } from '../streetEditing.ts';

const track: TrackComposition = {
    id: 'track',
    segments: [{ id: 'segment', segmentId: 'segment', type: SEGMENT }],
};

const point = (s: number): ParsedPoint => ({ l: 11, b: 48, e: 0, t: 0, s });

describe('street map editing actions', () => {
    it('starts a new street selection at the requested insertion position', () => {
        const dispatch = vi.fn();
        const routePoints = getRoutePointReferences(track, [
            { id: 'segment', filename: 'segment', points: [point(1), point(1)] },
        ]);

        beginNewStreet(dispatch, 4, track, routePoints, 2);

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'segmentData/addStreetLookup' }));
        expect(dispatch).toHaveBeenLastCalledWith(
            expect.objectContaining({
                type: 'map/setStreetPointSelection',
                payload: expect.objectContaining({ trackId: 'track', streetIndex: 5, insertionIndex: 2 }),
            })
        );
    });

    it('keeps the existing waypoint fallback path available to map rendering', () => {
        expect(
            getStreetPath({
                streetName: 'Main',
                postCode: null,
                district: null,
                frontArrival: '',
                frontPassage: '',
                backPassage: '',
                pointFrom: { lat: 48, lon: 11, time: '' },
                pointTo: { lat: 49, lon: 12, time: '' },
                s: 1,
            })
        ).toEqual([
            { lat: 48, lon: 11, s: 1 },
            { lat: 49, lon: 12, s: 1 },
        ]);
    });

    it.each(['start', 'end'] as const)('clears the street highlight after editing the %s boundary', (boundary) => {
        const dispatch = vi.fn();
        const routePoints = getRoutePointReferences(track, [
            { id: 'segment', filename: 'segment', points: [point(1), point(1)] },
        ]);

        applyStreetSelection(
            dispatch,
            {
                trackId: 'track',
                streetIndex: 1,
                boundary,
                range: { start: 0, end: 1 },
            },
            routePoints,
            1
        );

        expect(dispatch).toHaveBeenCalledWith({ type: 'map/setHighlightedStreetPath', payload: undefined });
        expect(dispatch).toHaveBeenLastCalledWith({ type: 'map/setStreetPointSelection', payload: undefined });
    });

    it('keeps the highlight active between the two steps of adding a street', () => {
        const dispatch = vi.fn();
        const routePoints = getRoutePointReferences(track, [
            { id: 'segment', filename: 'segment', points: [point(1), point(1)] },
        ]);

        applyStreetSelection(
            dispatch,
            {
                trackId: 'track',
                streetIndex: 2,
                boundary: 'start',
                mode: 'add-start',
                range: { start: 0, end: 1 },
            },
            routePoints,
            0
        );

        expect(dispatch).not.toHaveBeenCalledWith({ type: 'map/setHighlightedStreetPath', payload: undefined });
        expect(dispatch).toHaveBeenLastCalledWith(
            expect.objectContaining({
                type: 'map/setStreetPointSelection',
                payload: expect.objectContaining({ mode: 'add-end' }),
            })
        );
    });

    it('clears the street highlight after completing the second step of adding a street', () => {
        const dispatch = vi.fn();
        const routePoints = getRoutePointReferences(track, [
            { id: 'segment', filename: 'segment', points: [point(1), point(1)] },
        ]);

        applyStreetSelection(
            dispatch,
            {
                trackId: 'track',
                streetIndex: 2,
                boundary: 'end',
                mode: 'add-end',
                range: { start: 0, end: 1 },
                startRouteIndex: 0,
            },
            routePoints,
            1
        );

        expect(dispatch).toHaveBeenCalledWith({ type: 'map/setHighlightedStreetPath', payload: undefined });
        expect(dispatch).toHaveBeenLastCalledWith({ type: 'map/setStreetPointSelection', payload: undefined });
    });

    it('aborts a new street selection and removes its temporary lookup entry', () => {
        const dispatch = vi.fn();

        abortStreetSelection(dispatch, {
            trackId: 'track',
            streetIndex: 2,
            boundary: 'end',
            mode: 'add-end',
            range: { start: 0, end: 1 },
            startRouteIndex: 0,
        });

        expect(dispatch).toHaveBeenCalledWith({ type: 'segmentData/removeStreetLookup', payload: 2 });
        expect(dispatch).toHaveBeenCalledWith({ type: 'map/setHighlightedStreetPath', payload: undefined });
        expect(dispatch).toHaveBeenLastCalledWith({ type: 'map/setStreetPointSelection', payload: undefined });
    });
});

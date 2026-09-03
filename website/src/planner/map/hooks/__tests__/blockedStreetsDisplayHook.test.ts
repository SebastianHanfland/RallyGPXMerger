import { describe, expect, it } from 'vitest';
import { createStreetTooltip } from '../blockedStreetsDisplayHook.ts';
import { BlockedStreetInfo } from '../../../logic/resolving/types.ts';

describe('createStreetTooltip', () => {
    it('renders each tooltip section on a separate line', () => {
        const tooltip = createStreetTooltip(
            {
                streetName: 'Main Street',
                postCode: '12345',
                frontArrival: '2022-02-02T02:00:00.000Z',
                backPassage: '2022-02-02T02:20:00.000Z',
            } as BlockedStreetInfo,
            [
                {
                    trackId: 'track-1',
                    trackName: 'Track 1',
                    frontArrival: '2022-02-02T02:00:00.000Z',
                    backPassage: '2022-02-02T02:10:00.000Z',
                    distanceInKm: 2.5,
                    speed: 15,
                },
                {
                    trackId: 'track-2',
                    trackName: 'Track 2',
                    frontArrival: '2022-02-02T02:05:00.000Z',
                    backPassage: '2022-02-02T02:15:00.000Z',
                    distanceInKm: 3,
                    speed: 18,
                },
            ],
            { blockage: 'Blockage', distance: 'Distance', speed: 'Speed', tracks: 'Tracks', unknown: 'Unknown' }
        );

        expect(tooltip.split('<br>')).toHaveLength(5);
        expect(tooltip).toContain('Track 1:');
        expect(tooltip).toContain('Track 2:');
    });

    it('escapes dynamic tooltip text', () => {
        const tooltip = createStreetTooltip(
            {
                streetName: '<Main>',
                postCode: '"123"',
                frontArrival: '2022-02-02T02:00:00.000Z',
                backPassage: '2022-02-02T02:20:00.000Z',
            } as BlockedStreetInfo,
            [
                {
                    trackId: 'track-1',
                    trackName: 'Track <1>',
                    frontArrival: '2022-02-02T02:00:00.000Z',
                    backPassage: '2022-02-02T02:10:00.000Z',
                },
            ],
            { blockage: 'Blockage', distance: 'Distance', speed: 'Speed', tracks: 'Tracks', unknown: 'Unknown' }
        );

        expect(tooltip).toContain('&lt;Main&gt;');
        expect(tooltip).toContain('&quot;123&quot;');
        expect(tooltip).toContain('Track &lt;1&gt;');
        expect(tooltip).not.toContain('<Main>');
    });
});

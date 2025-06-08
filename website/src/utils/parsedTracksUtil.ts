import { CalculatedTrack } from '../common/types.ts';

export function getStartAndEndOfParsedTracks(calculatedTracks: CalculatedTrack[]): { start: string; end: string } {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    calculatedTracks.forEach((track) => {
        const startTimeOfTrack = track.points[0].t;
        if (startTimeOfTrack < startDate) {
            startDate = startTimeOfTrack;
        }

        const endTimeOfTrack = track.points[track.points.length - 1].t;
        if (endTimeOfTrack > endDate) {
            endDate = endTimeOfTrack;
        }
    });

    return {
        start: startDate,
        end: endDate,
    };
}

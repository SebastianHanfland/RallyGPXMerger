import { ParsedTrack } from '../common/types.ts';

export function getStartAndEndOfParsedTracks(parsedTracks: ParsedTrack[]): { start: string; end: string } {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    parsedTracks.forEach((track) => {
        const startTimeOfTrack = track.points[0].time;
        if (startTimeOfTrack < startDate) {
            startDate = startTimeOfTrack;
        }

        const endTimeOfTrack = track.points[track.points.length - 1].time;
        if (endTimeOfTrack > endDate) {
            endDate = endTimeOfTrack;
        }
    });

    return {
        start: startDate,
        end: endDate,
    };
}

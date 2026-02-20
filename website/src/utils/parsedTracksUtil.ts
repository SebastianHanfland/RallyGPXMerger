import { CalculatedTrack } from '../common/types.ts';
import { TrackComposition } from '../planner/store/types.ts';
import { shiftEndTimeByParticipants } from '../planner/logic/resolving/aggregate/aggregatePoints.ts';

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

export function getStartAndEndPlanning(
    calculatedTracks: CalculatedTrack[],
    tracks: TrackComposition[],
    participantsDelayInSeconds: number
): { start: string; end: string } {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    calculatedTracks.forEach((calculatedTrack) => {
        const foundTrack = tracks.find((track) => track.id === calculatedTrack.id);
        if (calculatedTrack.points.length === 0) {
            return;
        }
        const startTimeOfTrack = calculatedTrack.points[0].t;
        if (startTimeOfTrack < startDate) {
            startDate = startTimeOfTrack;
        }

        const endTimeOfTrack = calculatedTrack.points[calculatedTrack.points.length - 1].t;
        const endTimeWithParticipants = shiftEndTimeByParticipants(
            endTimeOfTrack,
            foundTrack?.peopleCount ?? 0,
            participantsDelayInSeconds
        );
        if (endTimeWithParticipants > endDate) {
            endDate = endTimeWithParticipants;
        }
    });

    return {
        start: startDate,
        end: endDate,
    };
}

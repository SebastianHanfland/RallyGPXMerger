export const DELAY_PER_PERSON_IN_SECONDS = 0.2;

export function sumUpAllPeopleWithHigherPriority(
    segments: { segmentId: string; trackId: string; amount?: number }[],
    trackId: string
): number {
    const segmentsCopy = [...segments];
    segmentsCopy.sort((a, b) => ((a.amount ?? 0) > (b.amount ?? 0) ? -1 : 1));
    const indexOfTrack = segmentsCopy.findIndex((segment) => segment.trackId === trackId);

    let numberOfPeopleWithHigherPriority = 0;

    segmentsCopy.forEach((segment, index) => {
        if (index < indexOfTrack) {
            numberOfPeopleWithHigherPriority += segment.amount ?? 0;
        }
    });

    return numberOfPeopleWithHigherPriority;
}

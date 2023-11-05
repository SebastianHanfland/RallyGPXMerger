export interface EnrichedPoints {
    street: string;
    time: string;
}

interface AggregatedPoints {
    streetName: string;
    from: string;
    to: string;
}

export function aggregateEnrichedPoints(enrichedPoints: EnrichedPoints[]): AggregatedPoints[] {
    const aggregatedPoints: AggregatedPoints[] = [];
    enrichedPoints.forEach((point) => {
        if (aggregatedPoints.length === 0) {
            aggregatedPoints.push({ streetName: point.street, to: point.time, from: point.time });
            return;
        }

        const lastIndex = aggregatedPoints.length - 1;
        const lastElement = aggregatedPoints[lastIndex];

        if (lastElement.streetName === point.street) {
            aggregatedPoints[lastIndex] = { ...lastElement, to: point.time };
        } else {
            aggregatedPoints.push({ streetName: point.street, to: point.time, from: point.time });
        }
    });
    return aggregatedPoints;
}

export interface EnrichedPoints {
    street: string;
    time: string;
}

interface AggregatedPoints {
    streetName: string;
    from: string;
    to: string;
}

export function anyStreetNameMatch(streetName: string, lastStreetName: string): boolean {
    const streetNameElements = streetName.split(', ');
    return lastStreetName.startsWith(streetNameElements[0]);
}

export function takeMostDetailedStreetName(streetName: string, lastStreetName: string): string {
    if (!anyStreetNameMatch(streetName, lastStreetName)) {
        return streetName;
    }
    const streetNameElements = streetName.split(', ');
    const lastStreetNameElements = lastStreetName.split(', ');
    return [...new Set([...lastStreetNameElements, ...streetNameElements])].join(', ');
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

        const lastStreetName = lastElement.streetName;
        const streetName = point.street;
        if (anyStreetNameMatch(streetName, lastStreetName)) {
            const detailedStreetName = takeMostDetailedStreetName(streetName, lastStreetName);
            aggregatedPoints[lastIndex] = { ...lastElement, streetName: detailedStreetName, to: point.time };
        } else {
            aggregatedPoints.push({ streetName: point.street, to: point.time, from: point.time });
        }
    });
    return aggregatedPoints;
}

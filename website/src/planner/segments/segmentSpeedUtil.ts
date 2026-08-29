export type ParsedSegmentSpeedInput = {
    speed: number | undefined;
    forced: boolean;
};

export function parseSegmentSpeedInput(raw: string): ParsedSegmentSpeedInput {
    const hasForceMarker = raw.includes('!');
    const withoutForceMarker = raw.replaceAll('!', '');
    if (!withoutForceMarker) {
        return { speed: undefined, forced: false };
    }
    const number = Number(withoutForceMarker);
    if (isNaN(number)) {
        return { speed: undefined, forced: false };
    }
    const speed = number < 0 ? 0 : number;
    return { speed, forced: hasForceMarker && speed > 0 };
}

export function formatSegmentSpeedInput(speed: number | undefined, forced: boolean): string {
    if (speed === undefined || speed <= 0) {
        return '';
    }
    return forced ? `${speed}!` : speed.toString();
}

export function isForcedSegmentSpeed(
    forcedSegmentSpeeds: Record<string, boolean | undefined> | undefined,
    segmentSpeeds: Record<string, number | undefined> | undefined,
    id: string
): boolean {
    return (segmentSpeeds?.[id] ?? 0) > 0 && !!forcedSegmentSpeeds?.[id];
}

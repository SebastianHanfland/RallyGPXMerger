export function getColorFromUuid(uuid: string): string {
    return `#${uuid.slice(0, 6)}`;
}

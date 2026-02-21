export function getColorFromUuid(uuid: string = '1dc89ce7-d3b5-4054-b9e3-b3e062645d48'): string {
    return `#${uuid.slice(0, 6)}`;
}

export function getColor(element: { color?: string; id: string }): string {
    return element.color ?? getColorFromUuid(element.id);
}

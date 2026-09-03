export function getColorFromUuid(uuid: string = '1dc89ce7-d3b5-4054-b9e3-b3e062645d48'): string {
    return `#${uuid.slice(0, 6)}`;
}

export function getColorFromString(value: string): string {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return `#${(hash >>> 0).toString(16).slice(-6).padStart(6, '0')}`;
}

export function getColor(element: { color?: string; id: string }): string {
    return element.color ?? getColorFromUuid(element.id);
}

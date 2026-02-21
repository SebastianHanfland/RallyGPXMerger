export function toKey({ lat, lon }: { lat: number; lon: number }): string {
    return `lat:${lat.toFixed(10)}-lng:${lon.toFixed(10)}`;
}

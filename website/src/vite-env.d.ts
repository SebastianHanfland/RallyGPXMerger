/// <reference types="vite/client" />

declare module '@mapbox/polyline' {
    interface Polyline {
        encode(coordinates: [number, number][], precision?: number): string;
        decode(value: string, precision?: number): [number, number][];
    }

    const polyline: Polyline;
    export default polyline;
}

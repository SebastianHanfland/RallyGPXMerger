import { TileLayerOptions } from 'leaflet';

interface Config {
    tileUrlTemplate: string;
    maxZoom?: number;
    minZoom?: number;
    zoomOffset?: number;
    startZoom: number;
}

const generalConfig: Config = {
    tileUrlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 20,
    minZoom: 2,
    zoomOffset: 0,
    startZoom: 10,
};

export function getMapConfiguration() {
    const { tileUrlTemplate, maxZoom, minZoom, zoomOffset, startZoom } = generalConfig;

    function getOptions(): TileLayerOptions {
        return {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom,
            minZoom,
            id: 'mapbox/streets-v11',
            tileSize: 256,
            zoomOffset,
        };
    }

    return { tileUrlTemplate, startZoom, getOptions };
}

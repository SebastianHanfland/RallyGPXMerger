interface Variant {
    name: string;
    url: string;
    color: string;
}
export const versions: Record<string, Variant[]> = {
    sf24_v1_v3: [
        {
            name: 'Variante 1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/variante1_003.zip',
            color: 'blue',
        },
        {
            name: 'Variante 2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/variante2_002.zip',
            color: 'red',
        },
        {
            name: 'Variante 3',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/variante3_002.zip',
            color: 'green',
        },
    ],
    kvr_sf_23_sf_24_v3: [
        {
            name: 'SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23_like_SF24_gpx_002.zip',
            color: 'blue',
        },
        {
            name: 'SF24',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/v3_mitPause.zip',
            color: 'red',
        },
    ],
};

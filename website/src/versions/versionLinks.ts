export interface Variant {
    name: string;
    url: string;
    color?: string; // Optional: when not set, color is taken from the ids
    mode?: 'compare' | 'present';
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
    sf24_v1_v2_v3neu: [
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
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
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
    kvr_sf_23_sf_24_v3p: [
        {
            name: 'SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23like24_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'red',
        },
    ],
    kvr_sf_24_v3p: [
        {
            name: 'SF24',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'red',
        },
    ],
    kvr_sf_24_v3p_v3_3p: [
        {
            name: 'SF24',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_3_mitPausen.zip',
            color: 'red',
        },
    ],
    sf_24_v3_3p_v1p: [
        {
            name: 'SF24_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_3_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_v1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240204.zip',
            color: 'blue',
        },
    ],
    sf_24_v3_v1: [
        {
            name: 'SF24_v3_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_3_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_v1_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240315.zip',
            color: 'blue',
        },
    ],
    KVR_24_v3_v1: [
        {
            name: 'SF24_v3_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_v1_0319',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'red',
        },
    ],
    sf_24_v3_v1_96_v1_95_v1_95inv: [
        {
            name: 'SF24_v3_0315',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_3_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_v1_A96',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'blue',
        },
        {
            name: 'SF24_v1_A95',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A95_Planegg.zip',
            color: 'green',
        },
        {
            name: 'SF24_v1_A95_inv',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A95_Rückwärts.zip',
            color: 'purple',
        },
    ],
    AutobahnVarianten: [
        {
            name: '1_SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23like24_mitPausen.zip',
            color: 'blue',
        },
        {
            name: '2_SF24_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'red',
        },
        {
            name: '3_SF24_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A96_klein.zip',
            color: 'green',
        },
    ],
    nonKVR_24_A95variants: [
        {
            name: 'SF24_A96',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'red',
        },
        {
            name: 'SF24_A95_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A95_Vorwärts_Stadtwest.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A95_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A95_Rückwärts_Stadtwest.zip',
            color: 'green',
        },
    ],
    nonKVR_24_March: [
        {
            name: 'SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23like24_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_urspruenglich',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A96_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'green',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/4-A96_kurz.zip',
            color: 'yellow',
        },
        {
            name: 'SF24_A95_Vorwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/5-A95_vor.zip',
            color: 'brown',
        },
        {
            name: 'SF24_A95_Rueckwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/6-A95_rueck.zip',
            color: 'black',
        },
    ],
    nonKVR_24_March_BAB: [
        {
            name: 'SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23like24_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_urspruenglich',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/4-A96_kurz.zip',
            color: 'yellow',
        },
    ],
    nonKVR_24_March_A95: [
        {
            name: 'SF24_A96_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'green',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/4-A96_kurz.zip',
            color: 'yellow',
        },
        {
            name: 'SF24_A95_Vorwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/5-A95_vor.zip',
            color: 'brown',
        },
        {
            name: 'SF24_A95_Rueckwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/6-A95_rueck.zip',
            color: 'black',
        },
    ],
    //IMPORTANT: The following _BAB-variants might have to be kept online for the next 1-3 years (starting in 2024)
    KVR_24_03_BAB: [
        {
            name: 'SF23',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF23like24_mitPausen.zip',
            color: 'red',
        },
        {
            name: 'SF24_urspruenglich',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A96.zip',
            color: 'yellow',
        },
    ],
    KVR_24_03_A95: [
        {
            name: 'SF24_A96_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v1_mitPausen_20240319.zip',
            color: 'green',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A96.zip',
            color: 'yellow',
        },
        {
            name: 'SF24_A95_Vorwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_vor.zip',
            color: 'brown',
        },
        {
            name: 'SF24_A95_Rueckwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_rueck.zip',
            color: 'black',
        },
    ],
    SF_24_03_A95: [
        {
            name: 'SF24_A95_Rueckwaerts',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_rueck.zip',
            color: 'black',
        },
        {
            name: 'SF24_A95_RMpol',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_RMpol.zip',
            color: 'red',
        },
    ],
    SF_24_JSON: [
        {
            name: 'SF24_A95_RMpol',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_RMpol_correct.json',
            mode: 'present',
        },
    ],
    SF_24_p_JSON: [
        {
            name: 'SF24_A95_RMpol',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_RMpol_correct.json',
            color: 'red',
        },
        {
            name: 'SF24_A95_RMpol_p_0.75',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_p_0.75.json',
            color: 'blue',
        },
    ],
    Sternfahrt2024: [
        {
            name: 'SF24_A95_RMpol_p_0.75',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_ErstertStandWebsite.json',
            mode: 'present',
        },
    ],
    KVR_24_A95_seriell_parallel: [
        {
            name: 'SF24_A95_alter_Stand',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_rueck.zip',
            color: 'black',
        },
        {
            name: 'SF24_A95_seriell',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_seriell.zip',
            color: 'red',
        },
        {
            name: 'SF24_A95_parallel_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A95_parallel_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für_A95.zip',
            color: 'green',
        },
    ],
    KVR_24_A95_seriell: [
        {
            name: 'SF24_A95_seriell',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_seriell.json',
            mode: 'present',
        },
    ],
    KVR_24_A95_parallel_1: [
        {
            name: 'SF24_A95_parallel_1',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für.json',
            mode: 'present',
        },
    ],
    KVR_24_A95_parallel_2: [
        {
            name: 'SF24_A95_parallel_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für_A95.json',
            mode: 'present',
        },
    ],
    KVR_24_chronik: [
        {
            name: 'SF24_urspruenglich',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24v3_mitPausen.zip',
            color: 'blue',
        },
        {
            name: 'SF24_A96_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A96.zip',
            color: 'green',
        },
        {
            name: 'SF24_A95_parallel_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für_A95.zip',
            color: 'red',
        },
    ],
    KVR_24_A95_Vgl_A7_8_9: [
        {
            name: 'SF24_A95_parallel_2',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/A95_parallel_Für_A95.zip',
            color: 'red',
        },
        {
            name: 'SF24_v1_A95_inv',
            url: 'https://sebastianhanfland.github.io/RallyGPXMerger/SF24_v1_A95_Rückwärts.zip',
            color: 'green',
        },
    ],
};
export const versionKey = window.location.search.split('&')[0].replace('?version=', '');

export function getColorOfVersion(versionName: string) {
    return versions[versionKey].find((version) => version.name === versionName)?.color;
}

export function getUrlOfVersion(versionName: string) {
    return versions[versionKey].find((version) => version.name === versionName)?.url;
}

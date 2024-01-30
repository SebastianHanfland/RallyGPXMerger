export function gpxShortener(loadedState: string): string {
    const unnecessaryGpxElements = [
        '<extensions>',
        '<gpxtpx:TrackPointExtension>',
        '<gpxtpx:Extensions>',
        '<surface>asphalt</surface>',
        '</gpxtpx:Extensions>',
        '</gpxtpx:TrackPointExtension>',
        '</extensions>',
        '  ',
    ];
    let trippedGpxs = loadedState;
    unnecessaryGpxElements.forEach((unusedTag) => {
        trippedGpxs = trippedGpxs.replaceAll(unusedTag, '');
    });
    return trippedGpxs;
}

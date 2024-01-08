export function gpxShortener(loadedState: string): string {
    const unnecessaryGpxElements = [
        '<extensions>\n',
        '<gpxtpx:TrackPointExtension>\n',
        '<gpxtpx:Extensions>\n',
        '<surface>asphalt</surface>\n',
        '</gpxtpx:Extensions>\n',
        '</gpxtpx:TrackPointExtension>\n',
        '</extensions>\n',
        '  ',
    ];
    let trippedGpxs = loadedState;
    unnecessaryGpxElements.forEach((unusedTag) => {
        trippedGpxs = trippedGpxs.replaceAll(unusedTag, '');
    });
    return trippedGpxs;
}

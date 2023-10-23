import { SimpleGPX } from '../SimpleGPX.ts';
describe('SimpleGPX', () => {
    it('merging two GPX files', () => {
        // given
        let first =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889">\n' +
            '<ele>2372</ele>\n' +
            '<name>LAGORETICO</name>\n' +
            '</wpt>\n' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n' +
            '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        let second =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889">\n' +
            '<ele>2372</ele>\n' +
            '<name>LAGORETICO</name>\n' +
            '</wpt>\n' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T11:09:57Z</time></trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T11:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        let manualMerged =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889">\n' +
            '<ele>2372</ele>\n' +
            '<name>LAGORETICO</name>\n' +
            '</wpt>\n' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n' +
            '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
            '</trkseg><trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T11:09:57Z</time></trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T11:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        // when
        const mergedGpxs = new SimpleGPX([SimpleGPX.fromString(first), SimpleGPX.fromString(second)]).toString();

        // then
        expect(mergedGpxs.replace(/\s/, '')).toEqual(manualMerged.replace(/\s/, ''));
    });
});

import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';
describe('SimpleGPX', () => {
    it('merging two GPX files', () => {
        // given
        let first =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889"><ele>2372</ele><name>LAGORETICO</name></wpt>\n' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n' +
            '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        let second =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889"><ele>2372</ele><name>RETICOLAGO</name></wpt>' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T11:09:57Z</time></trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T11:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        let manualMerged =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx creator="fabulator:gpx-builder" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +
            '<metadata></metadata>\n' +
            '<trk>\n' +
            '<name>Example gpx</name>\n' +
            '<number>1</number>\n' +
            '<trkseg>\n' +
            '<trkpt lat="46.57608333" lon="8.89241667">\n' +
            '<ele>2376</ele>\n' +
            '<time>2007-10-14T10:09:57.000Z</time>\n' +
            '</trkpt>\n' +
            '<trkpt lat="46.57661111" lon="8.89344444">\n' +
            '<ele>2376</ele>\n' +
            '<time>2007-10-14T10:14:08.000Z</time>\n' +
            '</trkpt>\n' +
            '</trkseg>\n' +
            '</trk>\n' +
            '<trk>\n' +
            '<name>Example gpx</name>\n' +
            '<number>1</number>\n' +
            '<trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667">\n' +
            '<ele>2376</ele>\n' +
            '<time>2007-10-14T11:09:57.000Z</time>\n' +
            '</trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444">\n' +
            '<ele>2376</ele>\n' +
            '<time>2007-10-14T11:14:08.000Z</time>\n' +
            '</trkpt>\n' +
            '</trkseg>\n' +
            '</trk>\n' +
            '<wpt lat="46.57638889" lon="8.89263889">\n' +
            '<ele>2372</ele>\n' +
            '<name>LAGORETICO</name>\n' +
            '</wpt>\n' +
            '<wpt lat="46.57638889" lon="8.89263889">\n' +
            '<ele>2372</ele>\n' +
            '<name>RETICOLAGO</name>\n' +
            '</wpt>\n' +
            '</gpx>';

        // when
        const mergedGpxs = mergeSimpleGPXs([SimpleGPX.fromString(first), SimpleGPX.fromString(second)]).toString();

        // then
        expect(mergedGpxs.replaceAll('  ', '')).toEqual(manualMerged.replaceAll('  ', ''));
    });
});

import { mergeSimpleGPXs, SimpleGPX } from '../SimpleGPX.ts';
import { Point } from 'gpxparser';
describe('SimpleGPX', () => {
    const first =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<gpx version="1.0">\n' +
        '<name>Example gpx</name>\n' +
        '<wpt lat="46.57638889" lon="8.89263889"><ele>2372</ele><name>LAGORETICO</name></wpt>\n' +
        '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
        '<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n' +
        '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
        '</trkseg></trk>\n' +
        '</gpx>';

    it('should find last start time stamp of first track', () => {
        // given
        const simpleGPX = SimpleGPX.fromString(first);

        // when
        const startTimeStamp = simpleGPX.getStart();

        // then
        expect(startTimeStamp).toEqual('2007-10-14T10:09:57.000Z');
    });

    it('should be able to shift the times within a gpx track', () => {
        // given
        const simpleGPX = SimpleGPX.fromString(first);
        const startTimeStamp = simpleGPX.getStart();
        expect(startTimeStamp).toEqual('2007-10-14T10:09:57.000Z');
        const arrivalDateTime = '2017-11-12T10:14:57.000Z';

        // when
        simpleGPX.shiftToArrivalTime(arrivalDateTime);
        expect(
            simpleGPX.tracks[0].points.map((point: Point) => ({ ...point, time: point.time?.toISOString() }))
        ).toEqual([
            {
                ele: 2376,
                lat: 46.57608333,
                lon: 8.89241667,
                time: '2017-11-12T10:10:46.000Z',
            },
            {
                ele: 2376,
                lat: 46.57661111,
                lon: 8.89344444,
                time: '2017-11-12T10:14:57.000Z',
            },
        ]);

        // then
        expect(simpleGPX.getStart()).toEqual('2017-11-12T10:10:46.000Z');
        expect(simpleGPX.getEnd()).toEqual('2017-11-12T10:14:57.000Z');
    });

    it('merging two GPX files', () => {
        // given

        const second =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx version="1.0">\n' +
            '<name>Example gpx</name>\n' +
            '<wpt lat="46.57638889" lon="8.89263889"><ele>2372</ele><name>RETICOLAGO</name></wpt>' +
            '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T11:09:57Z</time></trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T11:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        const manualMerged =
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

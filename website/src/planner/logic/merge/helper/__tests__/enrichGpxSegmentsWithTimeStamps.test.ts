import { enrichGpxSegmentsWithTimeStamps } from '../enrichGpxSegmentsWithTimeStamps.ts';
import { GpxSegment } from '../../../../../common/types.ts';

const exampleXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<gpx version="1.0">\n' +
    '<name>Example gpx</name>\n' +
    '<wpt lat="46.57638889" lon="8.89263889"><ele>2372</ele><name>LAGORETICO</name></wpt>\n' +
    '<trk><name>Example gpx</name><number>1</number><trkseg>\n' +
    '<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n' +
    '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
    '</trkseg></trk>\n' +
    '</gpx>';

describe('enrichGpxSegmentsWithTimeStamps', () => {
    it('should find a node', () => {
        // given
        const averageSpeed = 12.0;
        const gpxSegments: GpxSegment[] = [{ id: '1', content: exampleXml, filename: 'A' }];

        // when
        const resolvedGpxSegments = enrichGpxSegmentsWithTimeStamps(gpxSegments, averageSpeed, {});

        // then
        expect(resolvedGpxSegments).toHaveLength(1);
        expect(resolvedGpxSegments[0].content.getEnd()).toEqual('2020-10-10T10:00:29.415Z');
        expect(resolvedGpxSegments[0].content.getStart()).toEqual('2020-10-10T10:00:00.000Z');
    });
});

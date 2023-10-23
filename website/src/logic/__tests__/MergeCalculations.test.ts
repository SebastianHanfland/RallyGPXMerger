import { expect } from 'vitest';
import { mergeGpxs } from '../gpxMerger';
describe('Suite', () => {
    it('simple test', () => {
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
            '<trkpt lat="46.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T10:10:52Z</time></trkpt>\n' +
            '<trkpt lat="46.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T10:12:39Z</time></trkpt>\n' +
            '<trkpt lat="46.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T10:13:12Z</time></trkpt>\n' +
            '<trkpt lat="46.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T10:13:20Z</time></trkpt>\n' +
            '<trkpt lat="46.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T10:13:48Z</time></trkpt>\n' +
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
            '<trkpt lat="47.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T11:10:52Z</time></trkpt>\n' +
            '<trkpt lat="47.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T11:12:39Z</time></trkpt>\n' +
            '<trkpt lat="47.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T11:13:12Z</time></trkpt>\n' +
            '<trkpt lat="47.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T11:13:20Z</time></trkpt>\n' +
            '<trkpt lat="47.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T11:13:48Z</time></trkpt>\n' +
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
            '<trkpt lat="46.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T10:10:52Z</time></trkpt>\n' +
            '<trkpt lat="46.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T10:12:39Z</time></trkpt>\n' +
            '<trkpt lat="46.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T10:13:12Z</time></trkpt>\n' +
            '<trkpt lat="46.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T10:13:20Z</time></trkpt>\n' +
            '<trkpt lat="46.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T10:13:48Z</time></trkpt>\n' +
            '<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>\n' +
            '</trkseg><trkseg>\n' +
            '<trkpt lat="47.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T11:09:57Z</time></trkpt>\n' +
            '<trkpt lat="47.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T11:10:52Z</time></trkpt>\n' +
            '<trkpt lat="47.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T11:12:39Z</time></trkpt>\n' +
            '<trkpt lat="47.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T11:13:12Z</time></trkpt>\n' +
            '<trkpt lat="47.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T11:13:20Z</time></trkpt>\n' +
            '<trkpt lat="47.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T11:13:48Z</time></trkpt>\n' +
            '<trkpt lat="47.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T11:14:08Z</time></trkpt>\n' +
            '</trkseg></trk>\n' +
            '</gpx>';

        // when
        let mergedGpxs = mergeGpxs(first, second);

        // then
        expect(mergedGpxs).toEqual(manualMerged);
    });

    describe('test block', () => {
        const testCases = [
            { a: 5, b: 7, c: 12 },
            { a: 7, b: 7, c: 14 },
            { a: 10, b: 7, c: 17 },
        ];

        testCases.forEach(({ a, b, c }) =>
            it(`${a} + ${b} = ${c}`, () => {
                // when
                const result = a + b;
                // then
                expect(result).toEqual(c);
            })
        );
    });
});

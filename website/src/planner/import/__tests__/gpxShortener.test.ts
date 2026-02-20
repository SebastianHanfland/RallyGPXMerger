import { gpxShortener } from '../gpxShortener.ts';

describe('gpxShortener', () => {
    it('should remove unnecessary elements of gpx', () => {
        const exampleString =
            '<extensions>\n<gpxtpx:TrackPointExtension>\n<gpxtpx:Extensions>\n<surface>asphalt</surface>\n</gpxtpx:Extensions>\n</gpxtpx:TrackPointExtension>\n</extensions>\n</trkpt>\n<trkpt lat="48.148646" lon="11.568682">\n<ele>522';
        const shortened = gpxShortener(exampleString);

        expect(shortened).toEqual('\n\n\n\n\n\n\n</trkpt>\n<trkpt lat="48.148646" lon="11.568682">\n<ele>522');
    });
});

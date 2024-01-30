import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { ContentTable } from 'pdfmake/interfaces';
import { getHeader } from '../csv/trackStreetsCsv.ts';

export function createInfoTable(trackStreets: TrackStreetInfo): ContentTable {
    const trackInfo = getHeader(trackStreets)
        .split('\n')
        .slice(0, 7)
        .map((row) => row.split(';'));
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            widths: ['auto', 'auto'],

            body: trackInfo,
        },
    };
}

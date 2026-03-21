import { TrackStreetInfo } from '../../logic/resolving/types.ts';

import { getHeader } from '../getHeader.ts';
import { IntlShape } from 'react-intl';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}
export const InfoTablePdf = ({ trackStreets, intl }: Props) => {
    const trackInfo = getHeader(trackStreets, intl)
        .split('\n')
        .slice(0, 7)
        .map((row) => row.split(';'));

    return (
        <View style={pdfStyles.table}>
            <Text style={pdfStyles.bold}>{intl.formatMessage({ id: 'msg.trackInfo' })}</Text>
            {trackInfo.map((row, i) => (
                <View key={i} style={pdfStyles.row} wrap={false}>
                    <Text style={pdfStyles.col1}>
                        <Text style={pdfStyles.bold}>{row[0]}</Text>
                    </Text>
                    <Text style={pdfStyles.col2}>{row[1]}</Text>
                </View>
            ))}
        </View>
    );
};

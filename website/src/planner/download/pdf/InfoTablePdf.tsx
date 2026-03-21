import { TrackStreetInfo } from '../../logic/resolving/types.ts';

import { getHeader } from '../getHeader.ts';
import { IntlShape } from 'react-intl';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    table: {
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #EEE',
        paddingTop: 8,
        paddingBottom: 8,
    },
    bold: {
        fontWeight: 'bold',
    },
    col1: {
        width: '50%',
    },
    col2: {
        width: '50%',
    },
});

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
        <View style={styles.table}>
            <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.trackInfo' })}</Text>
            {trackInfo.map((row, i) => (
                <View key={i} style={styles.row} wrap={false}>
                    <Text style={styles.col1}>
                        <Text style={styles.bold}>{row[0]}</Text>
                    </Text>
                    <Text style={styles.col2}>{row[1]}</Text>
                </View>
            ))}
        </View>
    );
};

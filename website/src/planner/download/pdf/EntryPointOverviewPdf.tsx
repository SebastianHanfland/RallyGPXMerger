import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
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
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 'bold',
    },
    col1: {
        width: '33%',
    },
    col2: {
        width: '33%',
    },
    col3: {
        width: '34%',
    },
});

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}
export const EntryPointOverviewPdf = ({ trackStreets, intl }: Props) => {
    const entryPoints = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Entry);
    const startingPoint = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)[0];

    const startingLabel =
        trackStreets.startName ?? startingPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });

    const publishedStart = `${formatTimeOnly(trackStreets.publicStart ?? startingPoint.frontArrival)}`;

    return (
        <View>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    <Text style={styles.col1}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={styles.col2}>{intl.formatMessage({ id: 'msg.collectionTime' })} </Text>
                    <Text style={styles.col3}>{intl.formatMessage({ id: 'msg.startingTime' })} </Text>
                </View>
                <View key={-1} style={styles.row} wrap={false}>
                    <Text style={styles.col1}>
                        <Text style={styles.bold}>{startingLabel}</Text>
                    </Text>
                    <Text style={styles.col2}>{publishedStart}</Text>
                    <Text style={styles.col3}>{formatTimeOnly(startingPoint.frontArrival)}</Text>
                </View>
                {...entryPoints.map((entryPoint, index) => {
                    return (
                        <View key={index} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>
                                <Text style={styles.bold}>
                                    {entryPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                </Text>
                            </Text>
                            <Text style={styles.col2}>{formatTimeOnly(entryPoint.frontArrival)}</Text>
                            <Text style={styles.col3}>{formatTimeOnly(entryPoint.frontPassage)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';

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

export const BreakOverviewPdf = ({ trackStreets, intl }: Props) => {
    const breaks = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Break);

    if (breaks.length === 0) {
        return (
            <View>
                <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.breakPoints' })}</Text>
                <Text>{intl.formatMessage({ id: 'msg.noBreakPoints' })}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.breakPoints' })}</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    <Text style={styles.col1}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={styles.col2}>{intl.formatMessage({ id: 'msg.breakStart' })} </Text>
                    <Text style={styles.col3}>{intl.formatMessage({ id: 'msg.breakLength' })} </Text>
                </View>
                {...breaks.map((breakWayPoint, index) => {
                    return (
                        <View key={index} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>
                                <Text style={styles.bold}>
                                    <Link src={getLink(breakWayPoint)} style={{ color: 'blue' }}>
                                        {breakWayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={styles.col2}>{formatTimeOnly(breakWayPoint.frontArrival)}</Text>
                            <Text style={styles.col3}>
                                {breakWayPoint.breakLength ? `${breakWayPoint.breakLength.toFixed(0)} min` : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

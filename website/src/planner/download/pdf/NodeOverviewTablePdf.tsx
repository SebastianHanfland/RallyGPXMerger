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

export const NodeOverviewTablePdf = ({ trackStreets, intl }: Props) => {
    const nodes = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Node);

    if (nodes.length === 0) {
        return (
            <View>
                <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.nodePoints' })}</Text>
                <Text>{intl.formatMessage({ id: 'msg.noNodePoints' })}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.nodePoints' })}</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    <Text style={styles.col1}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={styles.col2}>{intl.formatMessage({ id: 'msg.pointInTime' })} </Text>
                    <Text style={styles.col3}>{intl.formatMessage({ id: 'msg.otherTracks' })} </Text>
                </View>
                {...nodes.map((nodePoint, index) => {
                    return (
                        <View key={index} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>
                                <Text style={styles.bold}>
                                    <Link src={getLink(nodePoint)} style={{ color: 'blue' }}>
                                        {nodePoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={styles.col2}>{formatTimeOnly(nodePoint.frontArrival)}</Text>
                            <Text style={styles.col3}>
                                {nodePoint.nodeTracks ? `${nodePoint.nodeTracks.join(', ')}` : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { getTrackTableHeaders } from '../getHeader.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';

function getAdditionalInfo(
    type: TrackWayPointType | undefined,
    nodeTracks: string[] | undefined,
    breakLength: number | undefined
) {
    if (type === TrackWayPointType.Break) {
        return `: Pause${breakLength ? ` (${breakLength}) min` : ''}`;
    }
    if (type === TrackWayPointType.Node) {
        return `: Knoten${nodeTracks ? ` (${nodeTracks.join(', ')})` : ''}`;
    }
    return '';
}

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

export const TrackStreetTablePdf = ({ trackStreets, intl }: Props) => {
    const tableHeader = getTrackTableHeaders(intl);

    return (
        <View>
            <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.streetOverview' })}</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    {tableHeader.map((text) => (
                        <Text style={styles.col1}>{text} </Text>
                    ))}
                </View>
                {...trackStreets.wayPoints.map((wayPoint, index) => {
                    return (
                        <View key={index} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>
                                <Text style={styles.bold}>
                                    <Link src={getLink(wayPoint)} style={{ color: 'blue' }}>
                                        {`${
                                            wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })
                                        }${getAdditionalInfo(
                                            wayPoint.type,
                                            wayPoint.nodeTracks,
                                            wayPoint.breakLength
                                        )}`}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={styles.col2}>{wayPoint.postCode ?? ''}</Text>
                            <Text style={styles.col2}>{wayPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={styles.col2}>
                                {wayPoint.distanceInKm ? formatNumber(wayPoint.distanceInKm ?? 0, 2) : ''}
                            </Text>
                            <Text style={styles.col2}>
                                {wayPoint.speed ? formatNumber(wayPoint.speed ?? 0, 1) : ''}
                            </Text>
                            <Text style={styles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.frontPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={styles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.backPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={styles.col2}>{formatTimeOnly(wayPoint.frontArrival)}</Text>
                            <Text style={styles.col2}>{formatTimeOnly(wayPoint.frontPassage)}</Text>
                            <Text style={styles.col2}>{formatTimeOnly(wayPoint.backPassage)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

import { BlockedStreetInfo } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { getBlockedStreetsHeader } from '../csv/blockedStreetsCsv.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontSize: 11,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
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
});

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    blockedStreets: BlockedStreetInfo[];
}

export const BlockedStreetsPdf = ({ blockedStreets, intl, planningLabel }: Props) => (
    <Document>
        <Page size="A4" style={styles.page} orientation={'landscape'}>
            <View style={styles.section}>
                <Text>{intl.formatMessage({ id: 'msg.blockedStreets' })}</Text>
                {planningLabel && <Text>{planningLabel}</Text>}
                <BlockedStreetsTablePdf blockedStreets={blockedStreets} intl={intl} />
            </View>
        </Page>
    </Document>
);

export const BlockedStreetsTablePdf = ({ blockedStreets, intl }: Props) => {
    const tableHeader = getBlockedStreetsHeader(intl).split(';');

    return (
        <View>
            <Text style={styles.bold}>{intl.formatMessage({ id: 'msg.streetOverview' })}</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    {tableHeader.map((text) => (
                        <Text style={styles.col1}>{text} </Text>
                    ))}
                </View>
                {...blockedStreets.map((streetPoint, index) => {
                    return (
                        <View key={index} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>{streetPoint.postCode ?? ''}</Text>
                            <Text style={styles.col1}>{streetPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={styles.col1}>
                                <Text style={styles.bold}>
                                    <Link src={getLink(streetPoint)} style={{ color: 'blue' }}>
                                        {streetPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={styles.col2}>
                                {formatNumber(
                                    streetPoint.distanceInKm ??
                                        (geoDistance(
                                            toLatLng(streetPoint.pointFrom),
                                            toLatLng(streetPoint.pointTo)
                                        ) as number),
                                    2
                                )}
                            </Text>
                            <Text style={styles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(streetPoint.backPassage, streetPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={styles.col2}>{formatTimeOnly(streetPoint.frontArrival)}</Text>
                            <Text style={styles.col2}>{formatTimeOnly(streetPoint.backPassage)}</Text>
                            <Text style={styles.col2}>{formatNumber(streetPoint.peopleCount)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

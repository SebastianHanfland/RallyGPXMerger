import { BlockedStreetInfo } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { getBlockedStreetsHeader } from '../csv/blockedStreetsCsv.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { Document, Link, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    blockedStreets: BlockedStreetInfo[];
}

export const BlockedStreetsPdf = ({ blockedStreets, intl, planningLabel }: Props) => (
    <Document>
        <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
            <View style={pdfStyles.section}>
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
            <Text style={pdfStyles.bold}>{intl.formatMessage({ id: 'msg.streetOverview' })}</Text>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    {tableHeader.map((text) => (
                        <Text style={pdfStyles.col1}>{text} </Text>
                    ))}
                </View>
                {...blockedStreets.map((streetPoint, index) => {
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={pdfStyles.col1}>{streetPoint.postCode ?? ''}</Text>
                            <Text style={pdfStyles.col1}>{streetPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={pdfStyles.col1}>
                                <Text style={pdfStyles.bold}>
                                    <Link src={getLink(streetPoint)} style={{ color: 'blue' }}>
                                        {streetPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={pdfStyles.col2}>
                                {formatNumber(
                                    streetPoint.distanceInKm ??
                                        (geoDistance(
                                            toLatLng(streetPoint.pointFrom),
                                            toLatLng(streetPoint.pointTo)
                                        ) as number),
                                    2
                                )}
                            </Text>
                            <Text style={pdfStyles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(streetPoint.backPassage, streetPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(streetPoint.frontArrival)}</Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(streetPoint.backPassage)}</Text>
                            <Text style={pdfStyles.col2}>{formatNumber(streetPoint.peopleCount)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

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
import { chunkList } from './chunkUtil.t.ts';

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    blockedStreets: BlockedStreetInfo[];
}

const colWidths = ['8%', '10%', '22%', '10%', '10%', '15%', '15%', '10%'].map((width) => ({ width }));

export const BlockedStreetsPdf = ({ blockedStreets, intl, planningLabel }: Props) => (
    <Document>
        {chunkList(blockedStreets, 15).map((blockStreetsChunk, index) => {
            return (
                <Page size="A4" style={pdfStyles.page} orientation={'landscape'} key={index}>
                    <View style={pdfStyles.section}>
                        <Text>{intl.formatMessage({ id: 'msg.blockedStreets' })}</Text>
                        {planningLabel && <Text>{planningLabel}</Text>}
                    </View>
                    <BlockedStreetsTablePdf blockedStreets={blockStreetsChunk} intl={intl} />
                </Page>
            );
        })}
    </Document>
);

export const BlockedStreetsTablePdf = ({ blockedStreets, intl }: Props) => {
    const tableHeader = getBlockedStreetsHeader(intl).split(';');

    return (
        <View>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    {tableHeader.map((text, index) => (
                        <Text style={colWidths[index]}>{text} </Text>
                    ))}
                </View>
                {...blockedStreets.map((streetPoint, index) => {
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={colWidths[0]}>{streetPoint.postCode ?? ''}</Text>
                            <Text style={colWidths[1]}>{streetPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={colWidths[2]}>
                                <Text style={pdfStyles.bold}>
                                    <Link src={getLink(streetPoint)} style={{ color: 'blue' }}>
                                        {streetPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={colWidths[3]}>
                                {formatNumber(
                                    streetPoint.distanceInKm ??
                                        (geoDistance(
                                            toLatLng(streetPoint.pointFrom),
                                            toLatLng(streetPoint.pointTo)
                                        ) as number),
                                    2
                                )}
                            </Text>
                            <Text style={colWidths[4]}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(streetPoint.backPassage, streetPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={colWidths[5]}>{formatTimeOnly(streetPoint.frontArrival)}</Text>
                            <Text style={colWidths[6]}>{formatTimeOnly(streetPoint.backPassage)}</Text>
                            <Text style={colWidths[7]}>{formatNumber(streetPoint.peopleCount)}</Text>
                        </View>
                    );
                })}
            </View>
            <Text style={{ height: 35 }}>{''} </Text>
        </View>
    );
};

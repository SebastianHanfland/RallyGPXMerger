import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { getTrackTableHeaders } from '../getHeader.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

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

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}

export const TrackStreetTablePdf = ({ trackStreets, intl }: Props) => {
    const tableHeader = getTrackTableHeaders(intl);

    return (
        <View>
            <Text style={pdfStyles.bold}>{intl.formatMessage({ id: 'msg.streetOverview' })}</Text>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    {tableHeader.map((text) => (
                        <Text style={pdfStyles.col1}>{text} </Text>
                    ))}
                </View>
                {...trackStreets.wayPoints.map((wayPoint, index) => {
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={pdfStyles.col1}>
                                <Text style={pdfStyles.bold}>
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
                            <Text style={pdfStyles.col2}>{wayPoint.postCode ?? ''}</Text>
                            <Text style={pdfStyles.col2}>{wayPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={pdfStyles.col2}>
                                {wayPoint.distanceInKm ? formatNumber(wayPoint.distanceInKm ?? 0, 2) : ''}
                            </Text>
                            <Text style={pdfStyles.col2}>
                                {wayPoint.speed ? formatNumber(wayPoint.speed ?? 0, 1) : ''}
                            </Text>
                            <Text style={pdfStyles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.frontPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={pdfStyles.col2}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.backPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(wayPoint.frontArrival)}</Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(wayPoint.frontPassage)}</Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(wayPoint.backPassage)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

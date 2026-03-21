import { TrackWayPointType, WayPoint } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { getTrackTableHeaders } from '../getHeader.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';
import { TrackStreetTableNodeRow } from './TrackStreetTableNodeRow.tsx';
import { TrackStreetTableBreakRow } from './TrackStreetTableBreakRow.tsx';
import { TrackStreetTableEntryPointRow } from './TrackStreetTableEntryPointRow.tsx';

interface Props {
    wayPoints: WayPoint[];
    intl: IntlShape;
}

const colWidths = ['22%', '7%', '11%', '6%', '10%', '7%', '7%', '10%', '10%', '10%'].map((width) => ({ width }));

export const TrackStreetTablePdf = ({ wayPoints, intl }: Props) => {
    const tableHeader = getTrackTableHeaders(intl);

    return (
        <View>
            <Text style={pdfStyles.sectionTitle}>{intl.formatMessage({ id: 'msg.streetOverview' })}</Text>
            <View style={pdfStyles.streetTable}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    {tableHeader.map((text, index) => (
                        <Text style={colWidths[index]}>{text} </Text>
                    ))}
                </View>
                {...wayPoints.map((wayPoint, index) => {
                    if (wayPoint.type === TrackWayPointType.Node) {
                        return (
                            <TrackStreetTableNodeRow
                                intl={intl}
                                colWidths={colWidths}
                                wayPoint={wayPoint}
                                key={index}
                            />
                        );
                    }
                    if (wayPoint.type === TrackWayPointType.Break) {
                        return (
                            <TrackStreetTableBreakRow
                                intl={intl}
                                colWidths={colWidths}
                                wayPoint={wayPoint}
                                key={index}
                            />
                        );
                    }
                    if (wayPoint.type === TrackWayPointType.Entry) {
                        return (
                            <TrackStreetTableEntryPointRow
                                intl={intl}
                                colWidths={colWidths}
                                wayPoint={wayPoint}
                                key={index}
                            />
                        );
                    }

                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={colWidths[0]}>
                                <Text>
                                    <Link src={getLink(wayPoint)} style={{ color: 'blue' }}>
                                        {wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={colWidths[1]}>{wayPoint.postCode ?? ''}</Text>
                            <Text style={colWidths[2]}>{wayPoint.district?.replace('Wahlkreis', '') ?? ''}</Text>
                            <Text style={colWidths[3]}>
                                {wayPoint.distanceInKm ? formatNumber(wayPoint.distanceInKm ?? 0, 2) : ''}
                            </Text>
                            <Text style={colWidths[4]}>
                                {wayPoint.speed ? formatNumber(wayPoint.speed ?? 0, 1) : ''}
                            </Text>
                            <Text style={colWidths[5]}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.frontPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={colWidths[6]}>
                                {formatNumber(
                                    getTimeDifferenceInSeconds(wayPoint.backPassage, wayPoint.frontArrival) / 60,
                                    1
                                )}
                            </Text>
                            <Text style={colWidths[7]}>{formatTimeOnly(wayPoint.frontArrival)}</Text>
                            <Text style={colWidths[8]}>{formatTimeOnly(wayPoint.frontPassage)}</Text>
                            <Text style={colWidths[9]}>{formatTimeOnly(wayPoint.backPassage)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

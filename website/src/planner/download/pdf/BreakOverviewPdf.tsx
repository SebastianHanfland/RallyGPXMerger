import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types';
import { createStreetPointUrl } from '../../../utils/streetPathUrl';
import { formatTimeOnly } from '../../../utils/dateUtil';
import { formatFixedNumber } from '../../../utils/numberUtil';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles';

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}

const colWidths = ['50%', '25%', '25%'].map((width) => ({ width }));

export const BreakOverviewPdf = ({ trackStreets, intl }: Props) => {
    const breaks = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Break);

    if (breaks.length === 0) {
        return (
            <View wrap={false}>
                <Text style={pdfStyles.sectionTitle}>{intl.formatMessage({ id: 'msg.breakPoints' })}</Text>
                <Text style={pdfStyles.text}>{intl.formatMessage({ id: 'msg.noBreakPoints' })}</Text>
            </View>
        );
    }

    return (
        <View wrap={false}>
            <Text style={pdfStyles.sectionTitle}>{intl.formatMessage({ id: 'msg.breakPoints' })}</Text>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    <Text style={colWidths[0]}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={colWidths[1]}>{intl.formatMessage({ id: 'msg.breakStart' })} </Text>
                    <Text style={colWidths[2]}>{intl.formatMessage({ id: 'msg.breakLength' })} </Text>
                </View>
                {...breaks.map((breakWayPoint, index) => {
                    const streetName = breakWayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={colWidths[0]}>
                                <Text style={pdfStyles.bold}>
                                    <Link
                                        src={createStreetPointUrl(breakWayPoint.pointFrom, streetName)}
                                        style={{ color: 'blue' }}
                                    >
                                        {streetName}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={colWidths[1]}>{formatTimeOnly(breakWayPoint.frontArrival)}</Text>
                            <Text style={colWidths[2]}>
                                {breakWayPoint.breakLength
                                    ? `${formatFixedNumber(breakWayPoint.breakLength, 0)} min`
                                    : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

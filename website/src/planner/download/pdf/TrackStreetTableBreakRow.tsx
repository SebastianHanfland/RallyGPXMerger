import { WayPoint } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { createStreetPointUrl } from '../../../utils/streetPathUrl.ts';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';

interface Props {
    wayPoint: WayPoint;
    intl: IntlShape;
    colWidths: { width: string }[];
}

export const TrackStreetTableBreakRow = ({ wayPoint, intl, colWidths }: Props) => {
    const streetName = wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });
    let width = 0;
    colWidths.slice(0, 5).forEach((colWidth) => {
        width += Number(colWidth.width.replace('%', ''));
    });
    return (
        <View key={wayPoint.streetName} style={pdfStyles.row} wrap={false}>
            <Text style={{ width: `${width}%` }}>
                <Text style={pdfStyles.bold}>
                    <Link src={createStreetPointUrl(wayPoint.pointFrom, streetName)} style={{ color: 'blue' }}>
                        {`${streetName}: Pause${wayPoint.breakLength ? ` (${wayPoint.breakLength}) min` : ''}`}
                    </Link>
                </Text>
            </Text>
            <Text style={colWidths[5]}>
                {formatNumber(getTimeDifferenceInSeconds(wayPoint.frontPassage, wayPoint.frontArrival) / 60, 1)}
            </Text>
            <Text style={colWidths[6]}>
                {formatNumber(getTimeDifferenceInSeconds(wayPoint.backPassage, wayPoint.frontArrival) / 60, 1)}
            </Text>
            <Text style={colWidths[7]}>{formatTimeOnly(wayPoint.frontArrival)}</Text>
            <Text style={colWidths[8]}>{formatTimeOnly(wayPoint.frontPassage)}</Text>
            <Text style={colWidths[9]}>{formatTimeOnly(wayPoint.backPassage)}</Text>
        </View>
    );
};
